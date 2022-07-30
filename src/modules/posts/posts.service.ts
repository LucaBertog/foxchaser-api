import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ImageKit = require('imagekit');
import { Model } from 'mongoose';

import { PayloadJwt, Post } from 'src/common/interfaces';
import { Exceptions } from 'src/common/utils/errors/exceptions.util';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  private readonly imageKit: any;

  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly exceptions: Exceptions,
  ) {
    this.imageKit = new ImageKit({
      publicKey: configService.get<string>('IMAGEKIT_PUBLIC_KEY'),
      privateKey: configService.get<string>('IMAGEKIT_PRIVATE_KEY'),
      urlEndpoint: configService.get<string>('IMAGEKIT_URL_ENDPOINT'),
    });
  }

  async createPost(
    createPost: CreatePostDto,
    image: Express.Multer.File,
    user: PayloadJwt,
  ) {
    try {
      if (!image && !createPost.text)
        throw new HttpException(
          'Você deve inserir uma imagem ou texto',
          HttpStatus.BAD_REQUEST,
        );

      if (image && createPost.text)
        throw new HttpException(
          'Somente imagem ou texto é permitido',
          HttpStatus.BAD_REQUEST,
        );

      if (image) {
        // eslint-disable-next-line no-var
        var { fileId: imageId, url: imageUrl } = await this.imageKit.upload({
          file: image.buffer.toString('base64'),
          fileName: `${user.id}-post`,
        });
      }

      const newPost = new this.postModel({
        userId: user.id,
        image: imageUrl ? `${imageUrl} ${imageId}` : undefined,
        ...createPost,
      });
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

      if (post.image) {
        const imgId = post.image.trim().split(' ')[1];
        if (imgId)
          this.imageKit.deleteFile(imgId, (err) => {
            if (err)
              throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
          });
      }

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
      return { posts: userPosts.concat(...friendPosts) };
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }

  async getPostsByUserId(id: string) {
    try {
      const posts = await this.postModel.find({ userId: id });
      return { posts };
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }
}
