import { Injectable } from '@nestjs/common';
import { CreatePerfumeTypeDto } from './dto/create-perfume-type.dto';
import { UpdatePerfumeTypeDto } from './dto/update-perfume-type.dto';
import { Repository } from 'typeorm';
import { PerfumeTypeEntity } from './entities/perfume-type.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PerfumeTypeService {
  constructor(
    @InjectRepository(PerfumeTypeEntity)
    private readonly perfumeTypeRepository: Repository<PerfumeTypeEntity>,
  ) {}

  async create(dto: CreatePerfumeTypeDto) {
    const perfumeType = this.perfumeTypeRepository.create(dto);
    return await this.perfumeTypeRepository.save(perfumeType);
  }

  async findAll() {
    return await this.perfumeTypeRepository.find();
  }

  async findOne(id: string) {
    const perfumeType = await this.perfumeTypeRepository.findOne({
      where: { id },
    });

    if (!perfumeType) {
      throw new Error(`PerfumeType con ID ${id} no encontrado`);
    }

    return perfumeType;
  }

  async update(id: string, dto: UpdatePerfumeTypeDto) {
    const perfumeType = await this.findOne(id);
    Object.assign(perfumeType, dto);

    return await this.perfumeTypeRepository.save(perfumeType);
  }

  async remove(id: string) {
    const perfumeType = await this.findOne(id);
    return await this.perfumeTypeRepository.delete(perfumeType);
  }
}
