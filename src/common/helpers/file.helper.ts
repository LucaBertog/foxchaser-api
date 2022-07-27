export const imageFileFilter = (req: any, file: any, callback: any) => {
  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
    req.fileValidationError = 'Somente arquivos de imagem são permitidos!';
    return callback(null, false);
  }
  callback(null, true);
};
