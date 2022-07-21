import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  // Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() user: RegisterDto) {
    const response = await this.authService.create(user);
    return { statusCode: HttpStatus.CREATED, ...response };
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    return this.authService.login(req.user._doc);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('teste')
  // async getProfile(@Request() req) {
  //   return req.user;
  // }
}
