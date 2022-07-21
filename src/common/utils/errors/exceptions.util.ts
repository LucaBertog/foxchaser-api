import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class Exceptions {
  handleHttpExceptions(error: any) {
    if (error.response && error.status) {
      throw new HttpException(error.response, error.status);
    } else {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
