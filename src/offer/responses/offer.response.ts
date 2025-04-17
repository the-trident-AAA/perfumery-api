import { ApiProperty } from '@nestjs/swagger';

export class OfferResponse {
  @ApiProperty({
    description: 'Representa el identificador único de la oferta',
    type: 'number',
    required: true,
  })
  id: number;

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
  typeOfOffer: string;
}
