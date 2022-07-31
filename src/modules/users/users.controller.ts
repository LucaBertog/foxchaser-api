import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
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
}
