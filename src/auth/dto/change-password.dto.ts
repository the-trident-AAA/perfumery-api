import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Representa la contraseña actual del usuario',
    required: true,
  })
  currentPassword: string;
  @ApiProperty({
    description: 'Representa la nueva contraseña que desea el usuario',
    required: true,
  })
  newPassword: string;
}
