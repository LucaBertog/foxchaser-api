import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PayloadJwt, Post } from 'src/common/interfaces';
import { Exceptions } from 'src/common/utils/errors/exceptions.util';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    private readonly usersService: UsersService,
    private readonly exceptions: Exceptions,
  ) {}

  async createPost(createPost: CreatePostDto, user: PayloadJwt) {
    try {
      const newPost = new this.postModel({ userId: user.id, ...createPost });
      const savedPost = await newPost.save();
      return { message: 'Post criado', post: savedPost };
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }

  async updatePost(id: string, updatePost: CreatePostDto, user: PayloadJwt) {
    try {
      const post = await this.postModel.findById(id);
      if (!post)
        throw new HttpException('Esse post não existe', HttpStatus.NOT_FOUND);

      if (post.userId === user.id) {
        await post.updateOne({ $set: updatePost });
        return { message: 'Post atualizado' };
      } else {
        throw new HttpException(
          'Você só pode atualizar os seus posts',
          HttpStatus.FORBIDDEN,
        );
      }
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }

  async deletePost(id: string, user: PayloadJwt) {
    try {
      const post = await this.postModel.findById(id);
      if (!post)
        throw new HttpException('Esse post não existe', HttpStatus.NOT_FOUND);

      if (post.userId === user.id) {
        await post.deleteOne();
        return { message: 'Post deletado' };
      } else {
        throw new HttpException(
          'Você só pode deletar os seus posts',
          HttpStatus.FORBIDDEN,
        );
      }
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }

  async getPostById(id: string) {
    try {
      const post = await this.postModel.findById(id);
      if (!post)
        throw new HttpException('Esse post não existe', HttpStatus.NOT_FOUND);
      return { post };
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }

  async getTimeline(user: PayloadJwt) {
    try {
      const currentUser = await this.usersService.findById(user.id);
      const userPosts = await this.postModel.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId: string) => {
          return this.postModel.find({ userId: friendId });
        }),
      );
      return userPosts.concat(...friendPosts);
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }
}
