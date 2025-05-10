import { ApiProperty } from '@nestjs/swagger';

export class OfferResponse {
  @ApiProperty({
    description: 'Representa el identificador único de la oferta',
    type: 'string',
    required: true,
  })
  id: string;
  @ApiProperty({
    description: 'Representa el nombre de la oferta',
    type: 'string',
    required: true,
  })
  name: string;
  @ApiProperty({
    description: 'Representa la descripción de la oferta',
    type: 'string',
    required: true,
  })
  description: string;
  @ApiProperty({
    description: 'Representa el alcance de la oferta',
    type: 'string',
    required: true,
  })
  scope: string;

  @ApiProperty({
    description: 'Representa el descuento de la oferta en porcentaje',
    type: 'number',
    required: true,
  })
  discount: number;

  @ApiProperty({
    description: 'Representa el tipo de oferta',
    type: 'string',
    required: true,
  })
  offerType: string;

  constructor(
    id: string,
    discount: number,
    offerType: string,
    name: string,
    description: string,
    scope: string,
  ) {
    this.id = id;
    this.discount = discount;
    this.offerType = offerType;
    this.name = name;
    this.description = description;
    this.scope = scope;
  }
}
