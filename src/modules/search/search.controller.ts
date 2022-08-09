import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('search')
export class SearchController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:search')
  @HttpCode(HttpStatus.OK)
  async doResearch(@Param('search') search: string) {
    const usersResult = await this.usersService.searchUsers(search);
    return { usersResult };
  }
}
