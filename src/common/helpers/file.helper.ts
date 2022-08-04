import { SUPPORTED_FORMATS } from '../constants';

export const imageFileFilter = (req: any, file: any, callback: any) => {
  if (!SUPPORTED_FORMATS.includes(file.mimetype)) {
    req.fileValidationError = 'Somente arquivos de imagem são permitidos!';
    return callback(null, false);
  }
  callback(null, true);
};
