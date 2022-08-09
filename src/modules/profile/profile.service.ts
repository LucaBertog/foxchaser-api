import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FILE_SIZE } from '../../common/constants';
import { RequestInterfaceFile } from '../../common/interfaces';
import { Exceptions } from '../../common/utils/errors/exceptions.util';
import { UsersService } from '../users/users.service';
import { EditProfileDto } from './dto/edit-profile.dto';
import { FilesDto } from './dto/files.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ImageKit = require('imagekit');

@Injectable()
export class ProfileService {
  private readonly imageKit: any;

  constructor(
    private readonly usersService: UsersService,
    private readonly exceptions: Exceptions,
    private readonly configService: ConfigService,
  ) {
    this.imageKit = new ImageKit({
      publicKey: configService.get<string>('IMAGEKIT_PUBLIC_KEY'),
      privateKey: configService.get<string>('IMAGEKIT_PRIVATE_KEY'),
      urlEndpoint: configService.get<string>('IMAGEKIT_URL_ENDPOINT'),
    });
  }

  profileValidations(req, files, user) {
    if (
      (files.picture.length > 0 && files.picture[0].size > FILE_SIZE) ||
      (files.cover.length > 0 && files.cover[0].size > FILE_SIZE)
    )
      throw new HttpException(
        'Arquivo grande demais',
        HttpStatus.NOT_ACCEPTABLE,
      );

    if (req.fileValidationError)
      throw new HttpException(req.fileValidationError, HttpStatus.BAD_REQUEST);

    if (!user)
      throw new HttpException('Esse usuário não existe', HttpStatus.NOT_FOUND);
  }

  async editProfile(
    req: RequestInterfaceFile,
    EditProfile: EditProfileDto,
    files: FilesDto,
  ) {
    try {
      const user = await this.usersService.findById(req.user.id);

      if (files.picture) {
        const picId = user.profilePicture.trim().split(' ')[1];
        if (picId)
          this.imageKit.deleteFile(picId, (err) => {
            if (err)
              throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
          });
        // eslint-disable-next-line no-var
        var { fileId: pictureId, url: pictureUrl } = await this.imageKit.upload(
          {
            file: files.picture[0].buffer.toString('base64'),
            fileName: `${req.user.id}-picture`,
          },
        );
      }

      if (files.cover) {
        const cvId = user.coverPicture.trim().split(' ')[1];
        if (cvId)
          this.imageKit.deleteFile(cvId, (err) => {
            if (err)
              throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
          });
        // eslint-disable-next-line no-var
        var { fileId: coverId, url: coverUrl } = await this.imageKit.upload({
          file: files.cover[0].buffer.toString('base64'),
          fileName: `${req.user.id}-cover`,
        });
      }

      await user.updateOne({
        $set: {
          profilePicture: pictureUrl ? `${pictureUrl} ${pictureId}` : undefined,
          coverPicture: coverUrl ? `${coverUrl} ${coverId}` : undefined,
          ...EditProfile,
        },
      });

      return { message: 'Perfil atualizado' };
    } catch (error) {
      console.log(error);
      this.exceptions.handleHttpExceptions(error);
    }
  }
}
