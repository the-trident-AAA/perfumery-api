import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OrderService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateOrderDto) {
    const order = this.db.orderRespository.create(dto);
    const savedOrder = await this.db.orderRespository.save(order);

    // Create the relationships between Order and Perfume with quantities
    const orderPerfumes = await Promise.all(
      dto.perfumes.map(async (p) => {
        const perfume = await this.db.perfumeRepository.findOneBy({
          id: p.perfumeId,
        });
        return this.db.orderPerfumeRepository.create({
          order: savedOrder,
          perfume: perfume,
          cant: p.cant,
        });
      }),
    );

    await this.db.orderPerfumeRepository.save(orderPerfumes);

    return [savedOrder];
  }

  async findAll() {
    return await this.db.orderRespository.find({
      relations: ['orderPerfumes', 'orderPerfumes.perfume'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
