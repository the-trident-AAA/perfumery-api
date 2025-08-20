import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../entities/gender.enum';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePerfumeDto {
  @ApiProperty({
    description: 'Representa el nombre del perfume',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Representa la descripción del perfume',
    type: 'string',
    required: true,
  })
  description: string;

  @ApiProperty({
    description: 'Representa el nombre de la marca del perfume',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  @Transform(({ value }) => (value === '' ? null : value))
  brandId?: string;

  @ApiProperty({
    description: 'Representa el género del perfume',
    enum: Gender,
    required: true,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'Representa los IDs de los aromas del perfume',
    required: true,
    type: [String],
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
    }
    return value;
  })
  @IsArray()
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
  scentsId: string[];

  @ApiProperty({
    description: 'Representa los mililitros que contiene el perfume',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  milliliters?: number;

  @ApiProperty({
    description: 'Representa el tipo de perfume al que pertenece el perfume',
    required: true,
  })
  @IsString()
  perfumeTypeId: string;

  @ApiProperty({
    description: 'Representa si el perfume está disponible o no',
    required: true,
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  available: boolean;

  @ApiProperty({
    description: 'Representa el precio del perfume',
    required: true,
  })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  price: number;

  @ApiProperty({
    description: 'Representa la cantidad de perfumes disponibles',
    required: true,
  })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  cant: number;

  @ApiProperty({
    description: 'Representa al grupo de oferta al cual pertenece el perfume',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  @Transform(({ value }) => (value === '' ? null : value)) // Converts "" to null
  offerId?: string;

  @ApiProperty({
    description: 'Representa la imagen del perfume',
    type: 'string',
    format: 'binary',
    required: true,
  })
  image: Express.Multer.File;

  @ApiProperty({
    description: 'Representa las imágenes del perfume',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: false,
  })
  images?: Express.Multer.File[];
}
