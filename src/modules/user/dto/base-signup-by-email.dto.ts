import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class BaseSignUpByEmailDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(320)
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  surname!: string;
}
