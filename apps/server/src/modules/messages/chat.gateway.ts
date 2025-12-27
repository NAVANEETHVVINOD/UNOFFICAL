import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { WsAuthService } from '../../common/services/ws-auth.service';
import { ConfigService } from '@nestjs/config';
import { getWebSocketCorsConfig } from '../../config/cors.config';

@WebSocketGateway({
  cors: getWebSocketCorsConfig(),
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly wsAuthService: WsAuthService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    // Verify JWT token
    const payload = await this.wsAuthService.verifyToken(client);
    
    if (!payload) {
      console.log(`WS Client rejected (invalid auth): ${client.id}`);
      client.emit('error', { message: 'Authentication required' });
      client.disconnect(true);
      return;
    }

    // Attach user data to socket
    this.wsAuthService.attachUserToSocket(client, payload);
    console.log(`WS Client connected: ${client.id} (user: ${payload.sub})`);
    
    // Auto-join user's personal room for direct messages
    client.join(`user:${payload.sub}`);
  }

  handleDisconnect(client: Socket) {
    const userId = this.wsAuthService.getUserId(client);
    console.log(`WS Client disconnected: ${client.id} (user: ${userId || 'unknown'})`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() payload: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.wsAuthService.getUserId(client);
    if (!userId) {
      client.emit('error', { message: 'Not authenticated' });
      return;
    }

    if (payload.roomId) {
      client.join(payload.roomId);
      console.log(`Client ${client.id} joined room ${payload.roomId}`);
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() payload: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (payload.roomId) {
      client.leave(payload.roomId);
      console.log(`Client ${client.id} left room ${payload.roomId}`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    payload: { conversationId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.wsAuthService.getUserId(client);
    if (!userId) {
      client.emit('error', { message: 'Not authenticated' });
      return;
    }

    try {
      // Use authenticated user's ID instead of trusting client payload
      const newMessage = await this.messagesService.replyToConversation(
        userId,
        payload.conversationId,
        payload.content,
      );

      // Broadcast to room (including sender)
      this.server.to(payload.conversationId).emit('newMessage', newMessage);

      return newMessage;
    } catch (error) {
      console.error('SendMessage Error:', error);
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody()
    payload: {
      conversationId: string;
      isTyping: boolean;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.wsAuthService.getUserId(client);
    if (!userId) return;

    // Broadcast typing status with authenticated user ID
    this.server.to(payload.conversationId).emit('userTyping', {
      conversationId: payload.conversationId,
      userId,
      isTyping: payload.isTyping,
    });
  }
}
