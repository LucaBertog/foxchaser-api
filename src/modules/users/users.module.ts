import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Exceptions } from 'src/common/utils/errors/exceptions.util';
import { UserSchema } from 'src/models/users/entities/user.schema';
import { UsersService } from './users.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UsersService, Exceptions],
  exports: [UsersService],
})
export class UsersModule {}
