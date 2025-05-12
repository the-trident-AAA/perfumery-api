import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({
    description: 'Representa el nombre de la marca',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
