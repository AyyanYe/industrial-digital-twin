import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventsGateway } from '../events/events.gateway';

@Controller()
export class MotorController {
  constructor(private readonly eventsGateway: EventsGateway) {}

  @MessagePattern('sensors/motor/data')
  handleMotorData(@Payload() data: any) {
    console.log('Received Motor Data:', data);
    
    // Inject data into the WebSocket stream
    this.eventsGateway.broadcastMotorData(data);
  }
}