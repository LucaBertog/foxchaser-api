import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserSocket } from './common/interfaces';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'https://foxchaser.netlify.app',
      'https://foxchaser.vercel.app',
    ],
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger: Logger = new Logger('AppGateway');
  private users: UserSocket[] = [];

  afterInit(server: Server) {
    this.logger.log(`Initialized ${server._connectTimeout}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.removeUser(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
    this.server.emit('getUsers', this.users);
  }

  addUser({ userId, socketId, username }: UserSocket) {
    !this.users.some((user) => user.userId === userId) &&
      this.users.push({ userId, socketId, username });
  }

  removeUser(socketId: string) {
    this.users = this.users.filter((user) => user.socketId !== socketId);
  }

  @SubscribeMessage('newUser')
  handleNewUser(client: Socket, payload: UserSocket): void {
    this.addUser({
      socketId: client.id,
      ...payload,
    });
    client.data = {
      socketId: client.id,
      ...payload,
    };
    console.log(this.users);
    this.server.emit('getUsers', this.users);
  }
}
