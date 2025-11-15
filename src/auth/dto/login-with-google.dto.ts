import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class loginWithGoogleDto {
  @ApiProperty({
    description: 'Representa el id del inicio de sesión con google',
    required: true,
  })
  @IsString()
  idToken: string;
  @ApiProperty({
    description: 'ID de sesión del carrito anónimo a fusionar',
    required: false,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  sessionId?: string;
}
