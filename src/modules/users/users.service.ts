import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PayloadJwt } from '../../common/interfaces';
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

  async searchUsers(search: string) {
    try {
      const searchRegex = new RegExp(`${search}`, 'i');
      const result = await this.userModel.find({
        $or: [{ name: searchRegex }, { username: searchRegex }],
      });
      const personalizedResult = result.map((user) => ({
        id: user._id,
        name: user.name,
        username: user.username,
        profilePicture: user.profilePicture,
      }));
      return personalizedResult;
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }

  async getAllFriends(id: string) {
    try {
      const friends = [];
      const allUsers = await this.getAllUsers();

      allUsers.forEach(
        (user) =>
          user.followers.includes(id) &&
          user.followings.includes(id) &&
          friends.push({
            id: user.id,
            name: user.name,
            username: user.username,
            profilePicture: user.profilePicture,
            coverPicture: user.coverPicture,
            followers: user.followers,
            followings: user.followings,
            description: user.description,
            emblems: user.emblems,
          }),
      );

      return { friends };
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }
}
