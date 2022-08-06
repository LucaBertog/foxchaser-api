import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from 'src/common/interfaces';
import { Exceptions } from 'src/common/utils/errors/exceptions.util';
import { UsersService } from '../users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
    private readonly usersService: UsersService,
    private readonly exceptions: Exceptions,
  ) {}

  async newMessage({ receiver, sender, text }) {
    try {
      const createdMessage = new this.messageModel({ receiver, sender, text });
      return await createdMessage.save();
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }

  async getMessagesByUserIds({ userId, friendId }) {
    try {
      const messages = await this.messageModel.find({
        $and: [
          { $or: [{ receiver: userId }, { sender: userId }] },
          { $or: [{ receiver: friendId }, { sender: friendId }] },
        ],
      });

      return { messages };
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }
}
