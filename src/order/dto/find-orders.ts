import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { State } from '../entities/state.enum';

export class FindOrdersDto {
  @ApiProperty({
    description: 'Representa el estado del perfume',
    enum: State,
    required: false,
  })
  @IsOptional()
  @IsEnum(State)
  state?: State;

  @ApiProperty({
    description: 'Representa el nombre precio mínimo de los pedidos a buscar',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  lowPrice?: number;

  @ApiProperty({
    description: 'Representa el nombre precio máximo de los pedidos a buscar',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  highPrice?: number;

  @ApiProperty({
    description: 'Representa el id único del usuario',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId: string;
}
