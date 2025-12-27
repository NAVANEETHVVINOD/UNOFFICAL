import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { ChatGateway } from './chat.gateway';
import { WsAuthService } from '../../common/services/ws-auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.accessSecret'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, ChatGateway, WsAuthService],
})
export class MessagesModule {}
