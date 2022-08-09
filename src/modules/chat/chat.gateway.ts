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
import { Exceptions } from '../../common/utils/errors/exceptions.util';
import { UserSocket } from '../../common/interfaces';
import { MessagesService } from '../messages/messages.service';

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

  constructor(
    private readonly messagesService: MessagesService,
    private readonly exceptions: Exceptions,
  ) {}

  async getOnlineUsers() {
    const sockets = await this.server.fetchSockets();
    const users = sockets
      .map((socket) => Object.keys(socket.data).length !== 0 && socket.data)
      .filter((data) => data);
    this.server.emit('onlineUsers', users);
  }

  afterInit() {
    this.logger.log(`Initialized`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.getOnlineUsers();
  }

  @SubscribeMessage('newUser')
  handleNewUser(client: Socket, payload: UserSocket) {
    client.data = {
      userId: payload.userId,
      socketId: client.id,
    };
    this.getOnlineUsers();
  }

  @SubscribeMessage('newPrivateMessage')
  async handleNewPrivateMessage(client: Socket, payload: any) {
    await this.messagesService.newMessage({
      receiver: payload.receiver,
      sender: payload.sender,
      text: payload.text,
    });

    const { messages } = await this.messagesService.getMessagesByUserIds({
      friendId: payload.receiver,
      userId: payload.sender,
    });

    const sockets = await this.server.fetchSockets();
    sockets.forEach((socket) => {
      if (socket.data.userId === payload.receiver) {
        return this.server
          .to(socket.id)
          .emit('newMessage', { messages, sender: payload.sender });
      }
    });
    return client.emit('reloadedMessages', { messages });
  }

  @SubscribeMessage('reloadPrivateMessages')
  async handleReloadPrivateMessages(client: Socket, payload: any) {
    try {
      const { messages } = await this.messagesService.getMessagesByUserIds({
        userId: payload.userId,
        friendId: payload.friendId,
      });
      client.emit('reloadedMessages', { messages });
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }
}
