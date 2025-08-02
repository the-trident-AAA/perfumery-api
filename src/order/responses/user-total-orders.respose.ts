import { ApiProperty } from '@nestjs/swagger';

export class UserTotalOrdersResponse {
  @ApiProperty({
    description: 'Representa el total de pedidos del usuario',
    type: 'number',
  })
  total: number;

  constructor(total: number) {
    this.total = total;
  }
}
