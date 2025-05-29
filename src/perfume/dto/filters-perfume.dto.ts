import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../entities/gender.enum';

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

  @ApiProperty({
    description: 'Representa el tipo de perfume al que pertenece el perfume',
    type: 'string',
    isArray: true,
    required: false,
  })
  scentsIds: string[];

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
}
