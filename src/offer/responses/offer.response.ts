import { ApiProperty } from '@nestjs/swagger';

export class OfferResponse {
  @ApiProperty({
    description: 'Representa el identificador único de la oferta',
    type: 'string',
    required: true,
  })
  id: string;

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

  constructor(id: string, discount: number, offerType: string) {
    this.id = id;
    this.discount = discount;
    this.offerType = offerType;
  }
}
