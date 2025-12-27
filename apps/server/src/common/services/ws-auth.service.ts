import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';

export interface WsAuthPayload {
  sub: string;
  email: string;
  role: string;
  collegeId?: string;
}

@Injectable()
export class WsAuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  /**
   * Verify JWT token from WebSocket handshake
   * Returns the decoded payload if valid, null otherwise
   */
  async verifyToken(client: Socket): Promise<WsAuthPayload | null> {
    try {
      // Extract token from handshake auth or query params
      const token =
        client.handshake.auth?.token ||
        client.handshake.query?.token ||
        this.extractBearerToken(client.handshake.headers?.authorization as string);

      if (!token) {
        return null;
      }

      // Verify the token
      const payload = await this.jwtService.verifyAsync<WsAuthPayload>(token, {
        secret: this.config.get('jwt.accessSecret'),
      });

      return payload;
    } catch (error) {
      // Token is invalid or expired
      console.error('WS Auth Error:', error.message);
      return null;
    }
  }

  /**
   * Extract bearer token from Authorization header
   */
  private extractBearerToken(authHeader?: string): string | null {
    if (!authHeader) return null;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }

  /**
   * Attach user data to socket for later use
   */
  attachUserToSocket(client: Socket, payload: WsAuthPayload): void {
    (client as any).userId = payload.sub;
    (client as any).userEmail = payload.email;
    (client as any).userRole = payload.role;
    (client as any).collegeId = payload.collegeId;
  }

  /**
   * Get user ID from socket
   */
  getUserId(client: Socket): string | null {
    return (client as any).userId || null;
  }
}
