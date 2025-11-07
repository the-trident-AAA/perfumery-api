import { Injectable } from '@nestjs/common';
import { CreateScentDto } from './dto/create-scent.dto';
import { UpdateScentDto } from './dto/update-scent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ScentEntity } from './entities/scent.entity';
import { FindOptionsOrder, ILike, Repository } from 'typeorm';
import { ScentResponse } from './responses/scent.response';
import { DatabaseService } from 'src/database/database.service';
import { FiltersScentDto } from './dto/filters-scent.dto';
import { OrderDto } from 'src/utils/dto/order.dto';

@Injectable()
export class ScentService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateScentDto) {
    const scent = this.db.scentRepository.create(dto);
    return await this.db.scentRepository.save(scent);
  }

  async findAll(
    filtersScentDto: FiltersScentDto,
    orderDto: OrderDto,
  ): Promise<ScentResponse[]> {
    const { order, orderBy } = orderDto;

    const sortableFields = ['id', 'name'];

    const direction = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const orderClause: FindOptionsOrder<ScentEntity> =
      orderBy && sortableFields.includes(orderBy)
        ? { [orderBy]: direction }
        : { name: 'ASC' };

    const scents = await this.db.scentRepository.find({
      where: {
        ...(filtersScentDto.name && {
          name: ILike(`%${filtersScentDto.name}%`),
        }),
      },
      order: orderClause,
    });
    return scents.map((scent) => new ScentResponse(scent.id, scent.name));
  }

  async findOne(id: string): Promise<ScentResponse> {
    const scent = await this.db.scentRepository.findOne({
      where: { id },
    });

    if (!scent) {
      throw new Error(`Scent con ID ${id} no encontrado`);
    }

    return new ScentResponse(scent.id, scent.name);
  }

  async update(id: string, dto: UpdateScentDto) {
    const scent = await this.findOne(id);
    Object.assign(scent, dto);

    return await this.db.scentRepository.save(scent);
  }

  async remove(id: string) {
    return await this.db.scentRepository.delete({ id });
  }
}
