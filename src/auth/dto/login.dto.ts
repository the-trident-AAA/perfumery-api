import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class loginDto {
  @ApiProperty({
    description: 'Representa el nombre de usuario',
    required: true,
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Representa la contraseña del usuario',
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;
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
