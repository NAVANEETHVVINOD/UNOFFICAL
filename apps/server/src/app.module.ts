import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { CollegesModule } from './modules/colleges/colleges.module';
import { ClubsModule } from './modules/clubs/clubs.module';
import { EventsModule } from './modules/events/events.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { NotesModule } from './modules/notes/notes.module';
import { UploadModule } from './modules/upload/upload.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { PostsModule } from './modules/posts/posts.module';
import { HealthController } from './health.controller';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    AuthModule,
    PrismaModule,
    UsersModule,
    ProfilesModule,
    CollegesModule,
    ClubsModule,
    EventsModule,
    MarketplaceModule,
    NotesModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('Linker', {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    UploadModule,
    CertificatesModule,
    MessagingModule,
    FeedbackModule,
    PostsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
