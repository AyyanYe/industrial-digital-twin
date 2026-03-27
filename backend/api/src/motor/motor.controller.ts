import { EventsGateway } from '../events/events.gateway';
import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, ClientOptions, Transport, MessagePattern, Payload } from '@nestjs/microservices';

@Controller('motor')
export class MotorController {
  private client: ClientProxy;
  constructor(private readonly eventsGateway: EventsGateway) {
    this.client = ClientProxyFactory.create({
      transport: Transport.MQTT,
      options: {
        url: 'mqtts://055b4bf179fd47febadfa84365e1037a.s1.eu.hivemq.cloud:8883', // Update this!
        username: 'admin',
        password: 'Gayassnigga123',
        socketOptions: { rejectUnauthorized: true }
      },
    } as ClientOptions);
  }

  @Post('reboot')
  @HttpCode(200)
  rebootDevice() {
    console.log("Sending REBOOT command...");
    // Publish "REBOOT" to the topic Python is listening to
    this.client.emit('motor/admin', 'REBOOT'); 
    return { status: 'Command Sent' };
  }

  @MessagePattern('motor/data')
  handleMotorData(@Payload() data: any) {
    console.log('Received Motor Data:', data);
    
    // Inject data into the WebSocket stream
    this.eventsGateway.broadcastMotorData(data);
  }
}