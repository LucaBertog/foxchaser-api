import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  text: string;

  @IsString()
  @IsOptional()
  img: string;
}
