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
import { Exceptions } from 'src/common/utils/errors/exceptions.util';
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
  private users: UserSocket[] = [];

  constructor(
    private readonly messagesService: MessagesService,
    private readonly exceptions: Exceptions,
  ) {}

  afterInit(server: Server) {
    this.logger.log(`Initialized ${server._connectTimeout}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.removeUser(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
    this.server.emit('onlineUsers', this.users);
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
    this.server.emit('onlineUsers', this.users);
  }

  @SubscribeMessage('newPrivateMessage')
  async handleNewPrivateMessage(client: Socket, payload: any) {
    await this.messagesService.newMessage({
      receiver: payload.receiver,
      sender: payload.sender,
      text: payload.text,
    });

    const newMessages = await this.messagesService.getMessagesByUserIds({
      friendId: payload.receiver,
      userId: payload.sender,
    });
    this.server.emit('reloadedMessages', { newMessages });
  }

  @SubscribeMessage('reloadPrivateMessages')
  async handleReloadPrivateMessages(client: Socket, payload: any) {
    try {
      const { messages } = await this.messagesService.getMessagesByUserIds({
        userId: payload.userId,
        friendId: payload.friendId,
      });

      console.log(messages);
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }
}
