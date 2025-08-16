import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({
    description: 'Identificador del usuario al cual se le enviará el OTP',
    type: 'string',
  })
  @IsNotEmpty({ message: 'El identificador es requerido' })
  userId: string;
}
