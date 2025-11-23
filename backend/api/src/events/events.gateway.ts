import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  broadcastMotorData(data: any) {
    // Send data to all connected React clients
    this.server.emit('motor_update', data);
  }
}