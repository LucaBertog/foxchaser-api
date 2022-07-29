import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { imageFileFilter } from 'src/common/helpers/file.helper';
import { RequestInterface } from 'src/common/interfaces';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', { fileFilter: imageFileFilter }))
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Body() createPost: CreatePostDto,
    @Request() req: RequestInterface,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const response = await this.postsService.createPost(
      createPost,
      image,
      req.user,
    );
    return { statusCode: HttpStatus.CREATED, ...response };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updatePost(
    @Param('id') id: string,
    @Body() updatePost: CreatePostDto,
    @Request() req: RequestInterface,
  ) {
    const response = await this.postsService.updatePost(
      id,
      updatePost,
      req.user,
    );
    return { statusCode: HttpStatus.OK, ...response };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deletePost(@Param('id') id: string, @Request() req: RequestInterface) {
    const response = await this.postsService.deletePost(id, req.user);
    return { statusCode: HttpStatus.OK, ...response };
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getPostById(@Param('id') id: string) {
    const response = await this.postsService.getPostById(id);
    return { statusCode: HttpStatus.OK, ...response };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getTimeline(@Request() req: RequestInterface) {
    const response = await this.postsService.getTimeline(req.user);
    return { statusCode: HttpStatus.OK, ...response };
  }
}
