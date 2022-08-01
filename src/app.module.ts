import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { ProfileModule } from './modules/profile/profile.module';

console.log(process.env.MONGODB_URI);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/src/common/envs/.env`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: process.env.MONGODB_URI || config.get<string>('MONGODB_URI'),
      }),
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    ProfileModule,
  ],
})
export class AppModule {}
