import { ApiProperty } from '@nestjs/swagger';

export class StatisticalTip {
  @ApiProperty({
    description: 'Representa el nombre de la estadística',
    type: 'string',
    required: true,
  })
  statistics: string;
  @ApiProperty({
    description: 'Representa la información acerca de esa estadística',
    type: 'string',
    required: true,
  })
  info: string;
}

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
  @ApiProperty({
    description:
      'Representa la lista de tips sobre estadísticas que tiene el banner',
    type: StatisticalTip,
    required: true,
  })
  statisticalTips: StatisticalTip[];
  @ApiProperty({
    description: 'Representa la lista de tips informativas que tiene el banner',
    type: 'string',
    required: true,
  })
  infoTips: string[];

  constructor(
    id: string,
    title: string,
    description: string,
    images: string[],
    statisticalTips: StatisticalTip[],
    infoTips: string[],
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.images = images;
  }
}
