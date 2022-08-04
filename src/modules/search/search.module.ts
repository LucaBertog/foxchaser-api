import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { SearchController } from './search.controller';

@Module({
  imports: [UsersModule],
  controllers: [SearchController],
})
export class SearchModule {}
