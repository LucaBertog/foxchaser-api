import { Module } from '@nestjs/common';
import { Exceptions } from '../../common/utils/errors/exceptions.util';
import { UsersModule } from '../users/users.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [UsersModule],
  controllers: [ProfileController],
  providers: [ProfileService, Exceptions],
})
export class ProfileModule {}
