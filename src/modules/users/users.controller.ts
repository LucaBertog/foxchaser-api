import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestInterfaceFile } from 'src/common/interfaces';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/id/:id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: string) {
    const response: any = await this.usersService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      user: {
        id: response._doc._id,
        name: response._doc.name,
        username: response._doc.username,
        profilePicture: response._doc.profilePicture,
        coverPicture: response._doc.coverPicture,
        followers: response._doc.followers,
        followings: response._doc.followings,
        description: response._doc.description,
        emblems: response._doc.emblems,
      },
    };
  }

  @Get('/:username')
  @HttpCode(HttpStatus.OK)
  async getUserByUsername(@Param('username') username: string) {
    const response: any = await this.usersService.findByUsername(username);
    return {
      statusCode: HttpStatus.OK,
      user: {
        id: response._doc._id,
        name: response._doc.name,
        username: response._doc.username,
        profilePicture: response._doc.profilePicture,
        coverPicture: response._doc.coverPicture,
        followers: response._doc.followers,
        followings: response._doc.followings,
        description: response._doc.description,
        emblems: response._doc.emblems,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id/follow')
  @HttpCode(HttpStatus.OK)
  async followUser(@Param('id') id: string, @Req() req: RequestInterfaceFile) {
    const response = await this.usersService.followUser(id, req.user);
    return { statusCode: HttpStatus.OK, ...response };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id/unfollow')
  @HttpCode(HttpStatus.OK)
  async unfollowUser(
    @Param('id') id: string,
    @Req() req: RequestInterfaceFile,
  ) {
    const response = await this.usersService.unfollowUser(id, req.user);
    return { statusCode: HttpStatus.OK, ...response };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/friends')
  @HttpCode(HttpStatus.OK)
  async getAllFriends(@Param('id') id: string) {
    const response = await this.usersService.getAllFriends(id);
    return { statusCode: HttpStatus.OK, ...response };
  }
}
