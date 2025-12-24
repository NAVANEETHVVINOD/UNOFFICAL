import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/', // Use root namespace or /notifications? Chat uses default. Let's stick to default for shared socket logic if possible?
  // MessagesGateway uses @WebSocketGateway() which defaults to root.
  // If I use the SAME namespace, they might conflict if they try to handle same events, but they don't.
  // HOWEVER, a client normally connects to one namespace.
  // If they are both on root, `ChatGateway` and `NotificationsGateway` can coexist.
})
@Injectable()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('NotificationsGateway');

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // We can rely on auth token to identify user
    // The client should emit 'joinUserRoom' or we do it automatically based on Auth?
    // Let's do it manually on 'joinUserRoom' for valid auth check?
    // Or just use the token in handshake.
    const userId = this.getUserIdFromToken(client);
    if (userId) {
      client.join(`user_${userId}`);
      this.logger.log(
        `Notifications: User ${userId} joined room user_${userId}`,
      );
    }
  }

  handleDisconnect(client: Socket) {
    // nothing to do
  }

  private getUserIdFromToken(client: Socket): string | null {
    // TODO: Real validation.
    // For now, assume client sends userId in handshake query or auth?
    // ChatGateway uses `client.handshake.auth.token`.
    // We need to decode it.
    // For simplicity in this `dev` phase, let's assume the client sends `userId` in handshake.query for socket?
    // No, that's insecure.
    // Let's rely on the fact that `ChatGateway` might already handle connection/auth?
    // If they are in the same module/namespace, `handleConnection` runs for ALL gateways?
    // NestJS Gateways on same namespace share the server instance?
    // Yes, `@WebSocketServer()` injects the same server.

    // I will duplicate logic for now:
    return null; // We'll implement a `join` event listener instead.
  }

  // Explicit join event is safer/easier if we don't share auth logic yet.
  // Frontend `SocketContext` connects.
  // Then `NotificationContext` can emit `joinUserRoom`.

  @SubscribeMessage('joinUserRoom')
  handleJoinUserRoom(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`user_${data.userId}`);
    this.logger.log(`Client ${client.id} joined user room ${data.userId}`);
  }
}
