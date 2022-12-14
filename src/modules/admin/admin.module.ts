import { Module } from '@nestjs/common';
import { Exceptions } from '../../common/utils/errors/exceptions.util';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [PostsModule, UsersModule],
  controllers: [AdminController],
  providers: [Exceptions],
})
export class AdminModule {}
