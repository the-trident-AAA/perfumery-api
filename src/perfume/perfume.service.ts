import { Injectable } from '@nestjs/common';
import { CreatePerfumeDto } from './dto/create-perfume.dto';
import { UpdatePerfumeDto } from './dto/update-perfume.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PerfumeEntity } from './entities/perfume.entity';
import { Repository } from 'typeorm';
import { error } from 'console';
import { PerfumeResponse } from './responses/perfume.response';

@Injectable()
export class PerfumeService {
  constructor(
    @InjectRepository(PerfumeEntity)
    private readonly perfumeRepository: Repository<PerfumeEntity>,
  ) {}

  async create(dto: CreatePerfumeDto) {
    const perfume = this.perfumeRepository.create(dto);
    return await this.perfumeRepository.save(perfume);
  }

  async findAll(): Promise<PerfumeResponse[]> {
    const perfumes = await this.perfumeRepository.find({
      relations: ['brand', 'perfumeType'],
    });
    return perfumes.map(
      (perfume) =>
        new PerfumeResponse(
          perfume.id,
          perfume.name,
          perfume.brand.name,
          perfume.gender,
          perfume.liters,
          perfume.perfumeType.name,
          perfume.available,
          perfume.price,
          perfume.cant,
        ),
    );
  }

  async findOne(id: string) {
    const perfume = await this.perfumeRepository.findOne({
      where: { id },
    });

    if (!perfume) {
      throw new Error(`Perfume con ID ${id} no encontrado`);
    }

    return perfume;
  }

  async update(id: string, dto: UpdatePerfumeDto) {
    const perfume = await this.findOne(id);
    Object.assign(perfume, dto);

    return await this.perfumeRepository.save(perfume);
  }

  async remove(id: string) {
    const perfume = await this.findOne(id);
    if (!perfume) throw new error();
    return await this.perfumeRepository.delete(id);
  }
}
