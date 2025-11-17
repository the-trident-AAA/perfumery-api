import { ApiProperty } from '@nestjs/swagger';

export class CreateNewPasswordDto {
  @ApiProperty({
    description: 'Nueva contraseña',
    example: 'nuevaContraseña123',
  })
  newPassword: string;
}
