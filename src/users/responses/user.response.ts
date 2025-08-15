import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({
    description: 'Representa el identificador del usuario',
    type: 'string',
    required: true,
  })
  id: string;
  @ApiProperty({
    description: 'Representa el nombre de usuario del usuario',
    type: 'string',
    required: true,
  })
  username: string;
  @ApiProperty({
    description: 'Representa el avatar del usuario',
    type: 'string',
    required: false,
  })
  avatar?: string;
  @ApiProperty({
    description: 'Representa el email del usuario',
    type: 'string',
    required: true,
  })
  email: string;
  @ApiProperty({
    description: 'Representa el rol del usuario',
    type: 'string',
    required: true,
  })
  role: string;

  @ApiProperty({
    description: 'Indica si la cuenta del usuario ya fue activada o no',
    type: 'boolean',
  })
  isActive: boolean;

  constructor(
    id: string,
    username: string,
    avatar: string,
    email: string,
    role: string,
    isActive: boolean,
  ) {
    this.id = id;
    this.username = username;
    this.avatar = avatar;
    this.email = email;
    this.role = role;
    this.isActive = isActive;
  }
}
