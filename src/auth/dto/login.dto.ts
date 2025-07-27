import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class loginDto {
  @ApiProperty({
    description: 'Representa el nombre de usuario',
    required: true,
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Representa la contraseña del usuario',
    required: true,
  })
  @IsString()
  password: string;
}
