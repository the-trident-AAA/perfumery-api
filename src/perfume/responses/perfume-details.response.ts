import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../entities/gender.enum';
import { BrandResponse } from 'src/brand/responses/brand.response';
import { ScentResponse } from 'src/scent/responses/scent.response';
import { PerfumeTypeResponse } from 'src/perfume-type/responses/perfume-type.response';
import { OfferResponse } from 'src/offer/responses/offer.response';

export class PerfumeDetailsResponse {
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
    description: 'Representa la descripción del perfume',
    type: 'string',
    required: true,
  })
  description: string;

  @ApiProperty({
    description: 'Representa la url de la imagen del perfume',
    type: 'string',
    required: true,
  })
  image: string;

  @ApiProperty({
    description: 'Representa la marca del perfume',
    type: BrandResponse,
    required: false,
  })
  brand: BrandResponse;

  @ApiProperty({
    description: 'Representa el género del perfume',
    type: 'string',
    required: true,
  })
  gender: Gender;

  @ApiProperty({
    description: 'Representa las escencias perfume',
    type: ScentResponse,
    isArray: true,
    required: true,
  })
  scents: ScentResponse[];

  @ApiProperty({
    description: 'Representa los mililitros que contiene el perfume',
    type: 'number',
    required: false,
  })
  milliliters: number;

  @ApiProperty({
    description: 'Representa el tipo de perfume al que pertenece el perfume',
    type: PerfumeTypeResponse,
    required: true,
  })
  perfumeType: PerfumeTypeResponse;

  @ApiProperty({
    description: 'Representa la posible oferta seleccionada para el perfume',
    type: OfferResponse,
    required: true,
  })
  offer?: OfferResponse;

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

  @ApiProperty({
    description: 'Representa la imagen del perfume',
    type: 'string',
    required: true,
  })
  image: string;

  constructor(
    id: string,
    name: string,
    description: string,
    image: string,
    brand: BrandResponse,
    gender: Gender,
    scents: ScentResponse[],
    milliliters: number,
    perfumeType: PerfumeTypeResponse,
    available: boolean,
    price: number,
    cant: number,
    image: string,
    offer?: OfferResponse,
  ) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.brand = brand;
    this.gender = gender;
    this.scents = scents;
    this.milliliters = milliliters;
    this.perfumeType = perfumeType;
    this.available = available;
    this.price = price;
    this.cant = cant;
    this.image = image;
    this.offer = offer;
    this.description = description;
  }
}
