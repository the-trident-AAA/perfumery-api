import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'Representa el nombre de usuario del usuario',
    type: 'string',
    required: true,
  })
  username: string;
  @ApiProperty({
    description: 'Representa la dirección de correo electrónico del usuario',
    type: 'string',
    required: true,
  })
  email: string;
  @ApiProperty({
    description: 'Representa la contraseña del usuario',
    type: 'string',
    required: true,
  })
  password: string;
  @ApiProperty({
    description: 'Representa el rol del usuario a crear',
    type: 'string',
    required: false,
  })
  role?: Role;
}
