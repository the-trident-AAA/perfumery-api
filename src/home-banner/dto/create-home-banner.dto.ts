import { ApiProperty } from '@nestjs/swagger';

export class CreateHomeBannerDto {
  @ApiProperty({
    description: 'Representa el titulo del Banner del Home',
    type: 'string',
    required: true,
  })
  title: string;
  @ApiProperty({
    description: 'Representa la descripción del Banner del Home',
    type: 'string',
    required: true,
  })
  description?: string;
  @ApiProperty({
    description: 'Representa la imagen promocional del Banner del Home',
    type: 'string',
    required: true,
  })
  image?: string;
}
