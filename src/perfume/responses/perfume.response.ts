import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../entities/gender.enum';

export class PerfumeResponse {
  @ApiProperty({
    description: 'Representa el identificador único del perfume',
    type: 'string',
    required: true,
  })
  id: string;

  @ApiProperty({
    description: 'Representa el nombre del perfume',
    type: 'string',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'Representa el nombre de la marca del perfume',
    type: 'string',
    required: false,
  })
  brand: string;

  @ApiProperty({
    description: 'Representa el género del perfume',
    type: 'string',
    required: true,
  })
  gender: Gender;

  @ApiProperty({
    description: 'Representa el tipo de perfume al que pertenece el perfume',
    type: 'string',
    isArray: true,
    required: true,
  })
  scents: string[];

  @ApiProperty({
    description: 'Representa los mililitros que contiene el perfume',
    type: 'number',
    required: false,
  })
  liters: number;

  @ApiProperty({
    description: 'Representa el tipo de perfume al que pertenece el perfume',
    type: 'string',
    required: true,
  })
  perfumeType: string;

  @ApiProperty({
    description: 'Representa si el perfume está disponible o no',
    type: 'boolean',
    required: true,
  })
  available: boolean;

  @ApiProperty({
    description: 'Representa el precio del perfume',
    type: 'number',
    required: true,
  })
  price: number;

  @ApiProperty({
    description: 'Representa la cantidad de perfumes disponibles',
    type: 'number',
    required: true,
  })
  cant: number;

  constructor(
    id: string,
    name: string,
    brand: string,
    gender: Gender,
    scents: string[],
    liters: number,
    perfumeType: string,
    available: boolean,
    price: number,
    cant: number,
  ) {
    this.id = id;
    this.name = name;
    this.brand = brand;
    this.gender = gender;
    this.scents = scents;
    this.liters = liters;
    this.perfumeType = perfumeType;
    this.available = available;
    this.price = price;
    this.cant = cant;
  }
}
