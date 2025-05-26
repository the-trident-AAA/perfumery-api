import { ApiProperty } from '@nestjs/swagger';

export class CreateShopCartPerfumeDto {
  @ApiProperty({
    description: 'Representa el identificador del carrito',
    required: true,
  })
  shopCartId: string;
  @ApiProperty({
    description: 'Representa el identificador del perfume',
    required: true,
  })
  perfumeId: string;
  @ApiProperty({
    description:
      'Representa la cantidad de perfumes seleccionados de ese carrito',
    required: true,
  })
  cant: number;
}
