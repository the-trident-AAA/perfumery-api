import { IsString } from 'class-validator';

export class loginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
