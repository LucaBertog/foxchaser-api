import { MongodbError } from '../interfaces';

export const mongodbError = (error: MongodbError) => {
  const errors: string[] = [];

  switch (error.code) {
    case 11000:
      if (error.keyValue.hasOwnProperty('username'))
        errors.push('Nome já existe');
      if (error.keyValue.hasOwnProperty('email'))
        errors.push('Email já existe');
      return { errors, status: 400 };

    default:
      errors.push('Erro não identificado');
      return { errors, status: 500 };
  }
};
