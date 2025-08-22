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
    description: 'Representa las imagenes promocionales del Banner del Home',
    type: 'array',
    required: true,
  })
  images: string[];

  constructor(
    id: string,
    title: string,
    description: string,
    images: string[],
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.images = images;
  }
}
