import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
  })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({
    description: 'Código OTP de 6 dígitos',
    example: '123456',
  })
  @IsString({ message: 'El OTP debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El OTP es requerido' })
  @Length(6, 6, { message: 'El OTP debe tener exactamente 6 dígitos' })
  otp: string;
}
