import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestInterfaceFile } from 'src/common/interfaces';
import { Exceptions } from 'src/common/utils/errors/exceptions.util';
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

  async editProfile(
    req: RequestInterfaceFile,
    EditProfile: EditProfileDto,
    files: FilesDto,
  ) {
    try {
      if (req.fileValidationError)
        throw new HttpException(
          req.fileValidationError,
          HttpStatus.BAD_REQUEST,
        );

      const user = await this.usersService.findById(req.user.id);
      if (!user)
        throw new HttpException(
          'Esse usuário não existe',
          HttpStatus.NOT_FOUND,
        );

      if (files.picture) {
        const picId = user.profilePicture.split(' ')[1];
        this.imageKit.deleteFile(picId, (err) => {
          if (err)
            throw new HttpException(
              'Erro desconhecido',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
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
        const cvId = user.coverPicture.split(' ')[1];
        this.imageKit.deleteFile(cvId, (err) => {
          if (err)
            throw new HttpException(
              'Erro desconhecido',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });
        // eslint-disable-next-line no-var
        var { fileId: coverId, url: coverUrl } = await this.imageKit.upload({
          file: files.cover[0].buffer.toString('base64'),
          fileName: `${req.user.id}-cover`,
        });
      }

      await user.updateOne({
        $set: {
          profilePicture: `${pictureUrl} ${pictureId}`,
          coverPicture: `${coverUrl} ${coverId}`,
          ...EditProfile,
        },
      });

      return { message: 'Perfil atualizado' };
    } catch (error) {
      this.exceptions.handleHttpExceptions(error);
    }
  }
}
