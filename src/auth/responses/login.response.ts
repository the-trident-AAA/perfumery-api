import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty({
    description: 'Representa el token de acceso a los servicios de la API',
    type: 'string',
    required: true,
  })
  accessToken: string;
  @ApiProperty({
    description: 'Representa el indentificador único del usuario logeado',
    type: 'string',
    required: true,
  })
  id: string;
  @ApiProperty({
    description: 'Representa el nombre de usuario del usuario logeado',
    type: 'string',
    required: true,
  })
  username: string;
  @ApiProperty({
    description:
      'Representa la dirección de correo electrónico del usuario logeado',
    type: 'string',
    required: true,
  })
  email: string;
  @ApiProperty({
    description:
      'Representa el identificador único del carrito del usuario logeado',
    type: 'string',
    required: true,
  })
  shopCartId: string;

  constructor(
    accessToken: string,
    id: string,
    username: string,
    email: string,
    shopCartId: string,
  ) {
    this.accessToken = accessToken;
    this.id = id;
    this.username = username;
    this.email = email;
    this.shopCartId = shopCartId;
  }
}
