import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { mongodbError } from '../../errors/mongodb.errors';

@Injectable()
export class Exceptions {
  handleHttpExceptions(error: any) {
    if (error.response && error.status) {
      throw new HttpException(error.response, error.status);
    } else if (error.code) {
      const { errors, status } = mongodbError(error);
      throw new HttpException({ statusCode: status, errors }, status);
    } else {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
