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
import { HealthController } from './health.controller';

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
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule { }
