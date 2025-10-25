import { ApiProperty } from '@nestjs/swagger';

export class FiltersOfferDto {
  @ApiProperty({
    description: 'Representa el nombre del perfume',
    type: 'string',
    required: false,
  })
  name: string;

  @ApiProperty({
    description: 'Representa la descripción del perfume',
    type: 'string',
    required: false,
  })
  description: string;

  @ApiProperty({
    description: 'Representa el alcance de la oferta',
    type: 'string',
    required: false,
  })
  scope: string;

  @ApiProperty({
    description: 'Representa el intervalo inicial del descuento para filtrar',
    type: 'string',
    required: false,
  })
  minDiscount: number;

  @ApiProperty({
    description: 'Representa el intervalo final del descuento para filtrar',
    type: 'string',
    required: false,
  })
  maxDiscount: number;

  @ApiProperty({
    description: 'Representa el tipo de oferta para filtrar',
    type: 'string',
    required: false,
  })
  offerType: string;
}
