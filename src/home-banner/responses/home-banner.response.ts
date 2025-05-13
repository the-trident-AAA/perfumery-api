import { ApiProperty } from '@nestjs/swagger';

export class HomeBannerResponse {
  @ApiProperty({
    description: 'Representa el identificador único del Banner del Home',
    type: 'string',
    required: true,
  })
  id: string;
  @ApiProperty({
    description: 'Representa el titulo del Banner del Home',
    type: 'string',
    required: true,
  })
  title: string;
  @ApiProperty({
    description: 'Representa la descripción del Banner del Home',
    type: 'string',
    required: true,
  })
  description: string;
  @ApiProperty({
    description: 'Representa la imagen promocional del Banner del Home',
    type: 'string',
    required: true,
  })
  image: string;

  constructor(id: string, title: string, description: string, image: string) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image = image;
  }
}
