import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Exceptions } from '../../common/utils/errors/exceptions.util';
import { UserSchema } from '../../models/users/entities/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UsersService, Exceptions],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
