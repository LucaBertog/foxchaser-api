import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from '../common/interfaces/user.interface';
import { RegisterDto, LoginDto } from './dto';
import { Exceptions } from 'src/common/utils/errors/exceptions.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly exceptions: Exceptions,
  ) {}

  async create({ username, email, password }: RegisterDto) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const createdUser = new this.userModel({
        username,
        email,
        password: hashedPassword,
      });
      const savedUser = await createdUser.save();

      return { message: 'Novo usuário foi criado', newUser: savedUser };
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }

  async login({ email, password }: LoginDto) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user)
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        throw new HttpException('Senha incorreta', HttpStatus.NOT_ACCEPTABLE);

      return { message: 'Usuário foi logado', user };
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }
}
