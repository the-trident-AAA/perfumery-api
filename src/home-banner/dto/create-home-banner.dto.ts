import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class StatisticalTip {
  @ApiProperty({
    description: 'Representa el nombre de la estadística',
    type: 'string',
  })
  @IsString()
  statistics: string;

  @ApiProperty({
    description: 'Representa la información acerca de esa estadística',
    type: 'string',
  })
  @IsString()
  info: string;
}

export class HomeBannerFilter {
  @ApiProperty({
    description: 'Representa el nombre del filtro',
    type: 'string',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Representa el valor del filtro',
    type: 'string',
  })
  @IsString()
  value: string;
}

export class CreateHomeBannerDto {
  @ApiProperty({
    description: 'Representa el titulo del Banner del Home',
    type: 'string',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Representa la descripción del Banner del Home',
    type: 'string',
    required: true,
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Representa el texto del botón del banner',
    type: 'string',
    required: true,
  })
  @IsOptional()
  @IsString()
  buttonText: string;

  @ApiProperty({
    description: 'Representa la imagen del Banner del Home',
    type: 'string',
    format: 'binary',
    required: true,
  })
  image: Express.Multer.File;

  @ApiProperty({
    description:
      'Representa la lista de tips sobre estadísticas que tendrá el banner',
    type: StatisticalTip,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return []; // si no viene, devolver []
    if (Array.isArray(value)) {
      return value
        .map((v) => {
          try {
            return JSON.parse(v);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    }
    if (typeof value === 'string') {
      try {
        return [JSON.parse(value)];
      } catch {
        return [];
      }
    }
    return [];
  })
  @ValidateNested({ each: true })
  @Type(() => StatisticalTip)
  statisticalTips: StatisticalTip[];

  @ApiProperty({
    description:
      'Representa la lista de tips informativas que tendrá el banner',
    type: 'string',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return []; // si no viene, devolver []
    if (Array.isArray(value)) {
      return value.flatMap((v) => (typeof v === 'string' ? v.split(',') : []));
    }
    if (typeof value === 'string') {
      return value.split(',');
    }
    return [];
  })
  @IsArray()
  @IsString({ each: true })
  infoTips: string[];
  @ApiProperty({
    description: 'Representa la lista de filtros del banner',
    type: HomeBannerFilter,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return []; // si no viene, devolver []
    if (Array.isArray(value)) {
      return value
        .map((v) => {
          try {
            return JSON.parse(v);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    }
    if (typeof value === 'string') {
      try {
        return [JSON.parse(value)];
      } catch {
        return [];
      }
    }
    return [];
  })
  @ValidateNested({ each: true })
  @Type(() => HomeBannerFilter)
  filters: HomeBannerFilter[];
}
