import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class AnonymousShopCartDto {
  @ApiProperty({
    description: 'ID de sesión del carrito anónimo a fusionar',
    required: false,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  sessionId: string;
}
