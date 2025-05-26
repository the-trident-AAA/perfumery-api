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

  constructor(
    id: string,
    username: string,
    avatar: string,
    email: string,
    role: string,
  ) {
    this.id = id;
    this.username = username;
    this.avatar = avatar;
    this.email = email;
    this.role = role;
  }
}
