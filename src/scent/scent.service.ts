import { Injectable } from '@nestjs/common';
import { CreateScentDto } from './dto/create-scent.dto';
import { UpdateScentDto } from './dto/update-scent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ScentEntity } from './entities/scent.entity';
import { ILike, Repository } from 'typeorm';
import { ScentResponse } from './responses/scent.response';
import { DatabaseService } from 'src/database/database.service';
import { FiltersScentDto } from './dto/filters-scent.dto';

@Injectable()
export class ScentService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateScentDto) {
    const scent = this.db.scentRepository.create(dto);
    return await this.db.scentRepository.save(scent);
  }

  async findAll(filtersScentDto: FiltersScentDto): Promise<ScentResponse[]> {
    const scents = await this.db.scentRepository.find({
      where: {
        ...(filtersScentDto.name && {
          name: ILike(`%${filtersScentDto.name}%`),
        }),
      },
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
