import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Identificador del usuario',
    type: 'string',
  })
  @IsNotEmpty({ message: 'El identificador es requerido' })
  userId: string;

  @ApiProperty({
    description: 'Código OTP de 6 dígitos',
    example: '123456',
  })
  @IsString({ message: 'El OTP debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El OTP es requerido' })
  @Length(6, 6, { message: 'El OTP debe tener exactamente 6 dígitos' })
  otp: string;

  @ApiProperty({
    description: 'Nueva contraseña',
    example: 'nuevaContraseña123',
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La nueva contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  newPassword: string;
}
