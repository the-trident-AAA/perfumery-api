import { ApiProperty } from '@nestjs/swagger';

export class UpdateShopCartPerfumeDto {
  perfumeId: string;
  @ApiProperty({
    description:
      'Representa la cantidad de perfumes seleccionados de ese carrito',
    required: true,
  })
  cant: number;
}
