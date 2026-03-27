import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(@Inject('MQTT_CLIENT') private mqttClient: ClientProxy) {}

  broadcastMotorData(data: any) {
    // Send data to all connected React clients
    this.server.emit('motor_update', data);
  }

  @SubscribeMessage('reboot_command')
  handleRebootCommand(client: Socket) {
    console.log('Received reboot command from UI. Forwarding via MQTT...');
    this.mqttClient.emit('motor/admin', 'REBOOT');
  }
}