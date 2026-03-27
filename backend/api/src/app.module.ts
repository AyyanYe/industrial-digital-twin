import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
import { MotorController } from './motor/motor.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MQTT_CLIENT',
        transport: Transport.MQTT,
        options: {
          url: 'mqtts://055b4bf179fd47febadfa84365e1037a.s1.eu.hivemq.cloud:8883',
          username: 'admin',
          password: 'Gayassnigga123',
        },
      },
    ]),
  ],
  controllers: [AppController, MotorController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
