import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { imageFileFilter } from 'src/common/helpers/file.helper';
import { RequestInterfaceFile } from 'src/common/interfaces';
import { EditProfileDto } from './dto/edit-profile.dto';
import { FilesDto } from './dto/files.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Put()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'picture', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
      ],
      { fileFilter: imageFileFilter },
    ),
  )
  @HttpCode(HttpStatus.OK)
  async editProfile(
    @Req() req: RequestInterfaceFile,
    @Body() EditProfile: EditProfileDto,
    @UploadedFiles() files: FilesDto,
  ) {
    const response = await this.profileService.editProfile(
      req,
      EditProfile,
      files,
    );
    return { statusCode: HttpStatus.OK, ...response };
  }
}
