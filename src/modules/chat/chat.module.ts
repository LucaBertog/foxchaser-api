import { Module } from '@nestjs/common';
import { Exceptions } from 'src/common/utils/errors/exceptions.util';
import { MessagesModule } from '../messages/messages.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [MessagesModule],
  providers: [ChatGateway, Exceptions],
})
export class ChatModule {}
