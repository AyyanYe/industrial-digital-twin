import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
import { MotorController } from './motor/motor.controller';

@Module({
  imports: [],
  controllers: [AppController, MotorController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
