import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateShopCartPerfumeDto {
  @ApiProperty({
    description: 'Representa el identificador del carrito',
    required: true,
  })
  shopCartId?: string;
  @ApiProperty({
    description: 'Representa el identificador del perfume',
    required: true,
  })
  perfumeId: string;
  @ApiProperty({
    description:
      'ID de sesión del carrito anónimo al que se le desea añadir el shop cart perfume',
    required: false,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  sessionId?: string;
  @ApiProperty({
    description:
      'Representa la cantidad de perfumes seleccionados de ese carrito',
    required: true,
  })
  cant: number;
}
