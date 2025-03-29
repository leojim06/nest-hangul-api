import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SecurityGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private admins: string[] = [];

  handleConnection(client: any, ...args: any[]) {
    console.log(`Admin connected: ${client.id}`);
    this.admins.push(client.id);
  }

  handleDisconnect(client: any) {
    console.log(`Admin disconnected: ${client.id}`);
    this.admins = this.admins.filter((id) => id !== client.id);
  }

  sendSecurityAlert(message: string) {
    this.server.emit('securityAlert', message);
  }
}
