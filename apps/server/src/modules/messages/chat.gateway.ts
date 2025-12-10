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

@WebSocketGateway({
    cors: {
        origin: '*', // Allow all origins for now (dev mode)
        methods: ['GET', 'POST'],
        credentials: true,
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly messagesService: MessagesService) { }

    handleConnection(client: Socket) {
        const token = client.handshake.auth.token || client.handshake.query.token;
        // TODO: Verify token later
        console.log(`WS Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`WS Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @MessageBody() payload: { roomId: string },
        @ConnectedSocket() client: Socket,
    ) {
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
        @MessageBody() payload: { conversationId: string; content: string; senderId: string },
        @ConnectedSocket() client: Socket,
    ) {
        try {
            // 1. Save to DB
            const newMessage = await this.messagesService.replyToConversation(
                payload.senderId,
                payload.conversationId,
                payload.content,
            );

            // 2. Broadcast to room (including sender)
            // client.to(...) broadcasts to everyone BUT sender.
            // this.server.to(...) broadcasts to EVERYONE.
            this.server.to(payload.conversationId).emit('newMessage', newMessage);

            return newMessage;
        } catch (error) {
            console.error('SendMessage Error:', error);
            // Determine if we should emit an error back to client
            client.emit('error', { message: 'Failed to send message' });
        }
    }

    @SubscribeMessage('typing')
    handleTyping(
        @MessageBody() payload: { conversationId: string; userId: string; isTyping: boolean },
    ) {
        // Broadcast to room except sender? Or just everyone. 
        // Ideally everyone so the sender knows their query went through? No, sender knows they are typing.
        this.server.to(payload.conversationId).emit('userTyping', payload);
    }
}
