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
  @ApiProperty({
    description: 'Representa la imagen del listón en versión mobile',
    type: 'string',
    format: 'binary',
    required: true,
  })
  mobileImage: Express.Multer.File;
}
