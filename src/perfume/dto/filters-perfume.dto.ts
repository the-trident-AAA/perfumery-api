import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../entities/gender.enum';
import { IsOptional, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class FiltersPerfumeDto {
  @ApiProperty({
    description: 'Representa el identificador único del perfume',
    type: 'string',
    required: false,
  })
  id: string;

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
    description: 'Representa el nombre de la marca del perfume',
    type: 'string',
    required: false,
  })
  brandId: string;

  @ApiProperty({
    description: 'Representa el género del perfume',
    type: 'string',
    required: false,
  })
  gender: Gender;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsUUID('4', { each: true })
  @ApiProperty({
    description: 'IDs de los aromas asociados al perfume',
    type: 'array',
    required: false,
    isArray: true,
    example: [
      'a52fac27-df9d-4b38-9287-ff4146b1418d',
      'b6d8d69e-bc6e-4ebf-832e-1209f1d39e88',
    ],
  })
  scentsIds?: string[];

  @ApiProperty({
    description: 'Representa los mililitros que contiene el perfume',
    type: 'number',
    required: false,
  })
  milliliters: number;

  @ApiProperty({
    description: 'Representa el tipo de perfume al que pertenece el perfume',
    type: 'string',
    required: false,
  })
  perfumeTypeId: string;

  @ApiProperty({
    description: 'Representa si el perfume está disponible o no',
    type: 'boolean',
    required: false,
  })
  available: boolean;

  @ApiProperty({
    description: 'Representa el precio del perfume',
    type: 'number',
    required: false,
  })
  price: number;

  @ApiProperty({
    description: 'Representa la cantidad de perfumes disponibles',
    type: 'number',
    required: false,
  })
  cant: number;

  @ApiProperty({
    description: 'Representa la oferta',
    type: 'string',
    required: false,
  })
  offerId: string;
  @ApiProperty({
    description: 'Representa el límite inferior de precio',
    type: 'string',
    required: false,
  })
  priceMin?: number;
  @ApiProperty({
    description: 'Representa el límite superior de precio',
    type: 'string',
    required: false,
  })
  priceMax?: number;
  @ApiProperty({
    description: 'Representa el límite inferior de mililitros',
    type: 'string',
    required: false,
  })
  millilitersMin?: number;
  @ApiProperty({
    description: 'Representa el límite superior de mililitros',
    type: 'string',
    required: false,
  })
  millilitersMax?: number;

  @ApiProperty({
    description:
      'Representa el límite inferior del precio total (con descuento aplicado)',
    type: 'number',
    required: false,
  })
  totalPriceMin?: number;

  @ApiProperty({
    description:
      'Representa el límite superior del precio total (con descuento aplicado)',
    type: 'number',
    required: false,
  })
  totalPriceMax?: number;
  @ApiProperty({
    description: 'Representa el límite inferior de las ventas del perfume',
    type: 'number',
    required: false,
  })
  salesMin?: number;
  @ApiProperty({
    description: 'Representa el límite superior de las ventas del perfume',
    type: 'number',
    required: false,
  })
  salesMax?: number;
}
