import { IsMongoId } from 'class-validator';

export class DeletePostDto {
  @IsMongoId()
  userId: string;
}
