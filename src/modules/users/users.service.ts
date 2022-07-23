import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../common/interfaces/user.interface';
import { Exceptions } from '../../common/utils/errors/exceptions.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly exceptions: Exceptions,
  ) {}

  async create({ username, email, password }: any) {
    try {
      const createdUser = new this.userModel({
        username,
        email,
        password,
      });
      return await createdUser.save();
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }

  async findOne({ email }: { email: string }) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user)
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      return user;
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }

  async findById(id: string) {
    try {
      const user = await this.userModel.findById(id);
      if (!user)
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      return user;
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }
}
