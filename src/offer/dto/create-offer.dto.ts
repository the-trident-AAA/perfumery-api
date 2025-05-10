import { ApiProperty } from '@nestjs/swagger';

export class CreateOfferDto {
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
}
