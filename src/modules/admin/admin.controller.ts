import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestInterface } from 'src/common/interfaces';
import { Exceptions } from 'src/common/utils/errors/exceptions.util';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
    private readonly exceptions: Exceptions,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('users')
  @HttpCode(HttpStatus.OK)
  async getAllUsers(@Req() req: RequestInterface) {
    if (req.user.isAdmin) {
      try {
        return this.usersService.getAllUsers();
      } catch (error) {
        this.exceptions.handleHttpExceptions(error);
      }
    } else {
      throw new HttpException(
        'Você não é um administrador!',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('posts')
  @HttpCode(HttpStatus.OK)
  async getAllPosts(@Req() req: RequestInterface) {
    if (req.user.isAdmin) {
      try {
        return this.postsService.getAllPosts();
      } catch (error) {
        this.exceptions.handleHttpExceptions(error);
      }
    } else {
      throw new HttpException(
        'Você não é um administrador!',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
