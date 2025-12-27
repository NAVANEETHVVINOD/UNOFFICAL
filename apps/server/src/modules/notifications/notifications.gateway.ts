import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { WsAuthService } from '../../common/services/ws-auth.service';
import { getWebSocketCorsConfig } from '../../config/cors.config';

@WebSocketGateway({
  cors: getWebSocketCorsConfig(),
  namespace: '/',
})
@Injectable()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('NotificationsGateway');

  @WebSocketServer()
  server: Server;

  constructor(private readonly wsAuthService: WsAuthService) {}

  async handleConnection(client: Socket) {
    // Verify JWT token
    const payload = await this.wsAuthService.verifyToken(client);
    
    if (!payload) {
      this.logger.warn(`Notifications: Client rejected (invalid auth): ${client.id}`);
      client.emit('error', { message: 'Authentication required' });
      client.disconnect(true);
      return;
    }

    // Attach user data to socket
    this.wsAuthService.attachUserToSocket(client, payload);
    
    // Auto-join user's notification room based on verified user ID
    client.join(`user_${payload.sub}`);
    this.logger.log(`Notifications: User ${payload.sub} joined room user_${payload.sub}`);
  }

  handleDisconnect(client: Socket) {
    const userId = this.wsAuthService.getUserId(client);
    this.logger.log(`Notifications: Client disconnected: ${client.id} (user: ${userId || 'unknown'})`);
  }

  // Note: joinUserRoom event removed for security - users are auto-joined based on their verified JWT
}
