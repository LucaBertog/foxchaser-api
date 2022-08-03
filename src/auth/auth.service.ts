import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async create({ username, email, password }: RegisterDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.usersService.create({
      username,
      email,
      password: hashedPassword,
    });

    return { message: 'Novo usuário foi criado' };
  }

  async validateUser({ email, password }: { email: string; password: string }) {
    const user = await this.usersService.findOne({ email });
    const validPassword = await bcrypt.compare(password, user.password);

    if (user && validPassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login({ _id, username, email, isAdmin }) {
    return {
      access_token: this.jwtService.sign({ _id, username, email, isAdmin }),
    };
  }
}
