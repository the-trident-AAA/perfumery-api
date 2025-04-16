import { ApiProperty } from '@nestjs/swagger';

export class CreateOfferDto {
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
