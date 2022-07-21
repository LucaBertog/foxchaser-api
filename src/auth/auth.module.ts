import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Exceptions } from 'src/common/utils/errors/exceptions.util';
import { UserSchema } from 'src/models/users/entities/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [AuthController],
  providers: [AuthService, Exceptions],
})
export class AuthModule {}
