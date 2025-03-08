import { Injectable } from '@nestjs/common';
import { CreatePerfumeGroupDto } from './dto/create-perfume_group.dto';
import { UpdatePerfumeGroupDto } from './dto/update-perfume_group.dto';
import { Repository } from 'typeorm';
import { PerfumeGroup } from './entities/perfume_group.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PerfumeGroupService {
  constructor(
    @InjectRepository(PerfumeGroup)
    private readonly perfumeGroupRepository: Repository<PerfumeGroup>,
  ) {}

  async create(dto: CreatePerfumeGroupDto) {
    const perfumeGroup = this.perfumeGroupRepository.create(dto);
    return await this.perfumeGroupRepository.save(perfumeGroup);
  }

  async findAll() {
    return await this.perfumeGroupRepository.find();
  }

  async findOne(id: number) {
    const perfumeGroup = await this.perfumeGroupRepository.findOne({
      where: { id },
    });

    if (!perfumeGroup) {
      throw new Error(`PerfumeGroup con ID ${id} no encontrado`);
    }

    return perfumeGroup;
  }

  async update(id: number, dto: UpdatePerfumeGroupDto) {
    const perfumeGroup = await this.findOne(id);
    Object.assign(perfumeGroup, dto);

    return await this.perfumeGroupRepository.save(perfumeGroup);
  }

  async remove(id: number) {
    const perfumeGroup = await this.findOne(id);
    return await this.perfumeGroupRepository.delete(perfumeGroup);
  }
}
