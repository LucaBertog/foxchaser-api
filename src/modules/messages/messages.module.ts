import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from 'src/models/messages/entities/message.schema';
import { UsersModule } from '../users/users.module';
import { Exceptions } from 'src/common/utils/errors/exceptions.util';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    UsersModule,
  ],
  providers: [MessagesService, Exceptions],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
