import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

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
    description: 'Representa la imagen del perfume',
    type: 'string',
    format: 'binary',
    required: true,
  })
  image: Express.Multer.File;
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
}
