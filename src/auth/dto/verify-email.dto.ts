import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({
    description: 'Email de la cuenta a verificar',
    type: 'string',
  })
  email: string;
}
