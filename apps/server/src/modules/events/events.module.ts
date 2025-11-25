import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

import { QrService } from './qr.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService, QrService],
})
export class EventsModule {}
