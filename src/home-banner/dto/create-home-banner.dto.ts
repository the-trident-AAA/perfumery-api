import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class StatisticalTip {
  @ApiProperty({
    description: 'Representa el nombre de la estadística',
    type: 'string',
    required: true,
  })
  statistics: string;
  @ApiProperty({
    description: 'Representa la información acerca de esa estadística',
    type: 'string',
    required: true,
  })
  info: string;
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
    description: 'Representa las imágenes que se promocionarán en el banner',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: true,
  })
  images: Express.Multer.File[];
  @ApiProperty({
    description:
      'Representa la lista con los identificadores de los perfumes a los que hará referencia dicho banner',
    type: 'string',
    required: true,
    isArray: true,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
    }
    return value || [];
  })
  @IsArray()
  @IsOptional()
  perfumes?: string[];
  @ApiProperty({
    description:
      'Representa la lista de tips sobre estadísticas que tendrá el banner',
    type: StatisticalTip,
    required: true,
  })
  statisticalTips: StatisticalTip[];
  @ApiProperty({
    description:
      'Representa la lista de tips informativas que tendrá el banner',
    type: 'string',
    required: true,
  })
  infoTips: string[];
}
