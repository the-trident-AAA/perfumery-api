import { ApiProperty } from '@nestjs/swagger';

export class CreateTapeDto {
  @ApiProperty({
    description: 'Representa el nombre listón',
    type: 'string',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'Representa la imagen del listón',
    type: 'string',
    format: 'binary',
    required: true,
  })
  image: Express.Multer.File;
}
