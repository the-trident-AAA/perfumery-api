import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Representa el nombre de usuario del usuario',
    type: 'string',
    required: false,
  })
  username?: string;
  @ApiProperty({
    description: 'Representa el avatar del usuario',
    type: 'string',
    format: 'binary',
    required: false,
  })
  avatar?: Express.Multer.File;
}
