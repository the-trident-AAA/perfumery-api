import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Representa el nombre de usuario',
    required: true,
  })
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'Representa el correo del usuario',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Representa la contraseña del usuario',
    required: true,
  })
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;
}
