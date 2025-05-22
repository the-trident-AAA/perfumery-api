import { ApiProperty } from '@nestjs/swagger';

export class CreatePerfumeTypeDto {
  @ApiProperty({
    description: 'Representa el nombre del tipo de perfume',
    type: 'string',
    required: true,
  })
  name: string;
  @ApiProperty({
    description: 'Representa la imagen del tipo de perfume',
    type: 'string',
    format: 'binary',
    required: false,
  })
  image?: Express.Multer.File;
}
