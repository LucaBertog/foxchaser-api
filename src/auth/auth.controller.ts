import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() user: RegisterDto) {
    const response = await this.authService.create(user);
    return { statusCode: HttpStatus.CREATED, ...response };
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: LoginDto) {
    const response = await this.authService.login(user);
    return { statusCode: HttpStatus.OK, ...response };
  }
}
