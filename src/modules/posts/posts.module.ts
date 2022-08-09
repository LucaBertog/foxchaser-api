import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostSchema } from '../../models/posts/entities/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Exceptions } from '../../common/utils/errors/exceptions.util';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
    UsersModule,
  ],
  providers: [PostsService, Exceptions],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
