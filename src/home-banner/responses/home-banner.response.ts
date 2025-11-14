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

export class HomeBannerFilter {
  @ApiProperty({
    description: 'Representa el nombre del filtro',
    type: 'string',
  })
  name: string;

  @ApiProperty({
    description: 'Representa el valor del filtro',
    type: 'string',
  })
  value: string;
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
    description: 'Indica si el Banner es el principal o no',
    type: 'boolean',
    required: true,
  })
  isMain: boolean;
  @ApiProperty({
    description: 'Representa la promocional del Banner del Home',
    type: 'string',
    required: true,
  })
  image: string;
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
  @ApiProperty({
    description: 'Representa la lista filtros del banner',
    type: HomeBannerFilter,
    required: true,
  })
  filters: HomeBannerFilter[];

  constructor(
    id: string,
    title: string,
    description: string,
    isMain: boolean,
    image: string,
    statisticalTips: StatisticalTip[],
    infoTips: string[],
    filters: HomeBannerFilter[],
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.isMain = isMain;
    this.image = image;
    this.statisticalTips = statisticalTips;
    this.infoTips = infoTips;
    this.filters = filters;
  }
}
