import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PayloadJwt } from 'src/common/interfaces';
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
        name: username,
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

  async findByUsername(username: string) {
    try {
      const user = await this.userModel.findOne({ username });
      if (!user)
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      return user;
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }

  async followUser(id: string, currentUserPayload: PayloadJwt) {
    if (id !== currentUserPayload.id) {
      try {
        const user = await this.userModel.findById(id);
        const currentUser = await this.userModel.findById(
          currentUserPayload.id,
        );
        if (!user || !currentUser)
          throw new HttpException(
            'Um dos usuários não existe!',
            HttpStatus.NOT_FOUND,
          );

        if (!user.followers.includes(currentUserPayload.id)) {
          await user.updateOne({
            $push: { followers: currentUserPayload.id },
          });
          await currentUser.updateOne({ $push: { followings: id } });
          return { message: 'Usuário seguido com sucesso!' };
        } else {
          throw new HttpException(
            'Você já segue esse usuário!',
            HttpStatus.FORBIDDEN,
          );
        }
      } catch (error) {
        this.exceptions.handleHttpExceptions(error);
      }
    } else {
      throw new HttpException(
        'Você não pode seguir você mesmo!',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async unfollowUser(id: string, currentUserPayload: PayloadJwt) {
    if (id !== currentUserPayload.id) {
      try {
        const user = await this.userModel.findById(id);
        const currentUser = await this.userModel.findById(
          currentUserPayload.id,
        );
        if (!user || !currentUser)
          throw new HttpException(
            'Um dos usuários não existe!',
            HttpStatus.NOT_FOUND,
          );

        if (user.followers.includes(currentUserPayload.id)) {
          await user.updateOne({
            $pull: { followers: currentUserPayload.id },
          });
          await currentUser.updateOne({ $pull: { followings: id } });
          return { message: 'Você parou de seguir esse usuário com sucesso!' };
        } else {
          throw new HttpException(
            'Você já não segue esse usuário!',
            HttpStatus.FORBIDDEN,
          );
        }
      } catch (error) {
        this.exceptions.handleHttpExceptions(error);
      }
    } else {
      throw new HttpException(
        'Você não pode parar de seguir você mesmo!',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getAllUsers() {
    try {
      return this.userModel.find();
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }
}
