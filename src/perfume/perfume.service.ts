import { Injectable } from '@nestjs/common';
import { CreatePerfumeDto } from './dto/create-perfume.dto';
import { UpdatePerfumeDto } from './dto/update-perfume.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Perfume } from './entities/perfume.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PerfumeService {
  constructor(
    @InjectRepository(Perfume)
    private readonly perfumeRepository: Repository<Perfume>,
  ) {}

  async create(dto: CreatePerfumeDto) {
    const perfume = this.perfumeRepository.create(dto);
    return await this.perfumeRepository.save(perfume);
  }

  async findAll() {
    return await this.perfumeRepository.find();
  }

  async findOne(id: number) {
    const perfume = await this.perfumeRepository.findOne({
      where: { id },
    });

    if (!perfume) {
      throw new Error(`Perfume con ID ${id} no encontrado`);
    }

    return perfume;
  }

  async update(id: number, dto: UpdatePerfumeDto) {
    const perfume = await this.findOne(id);
    Object.assign(perfume, dto);

    return await this.perfumeRepository.save(perfume);
  }

  async remove(id: number) {
    const perfume = await this.findOne(id);
    return await this.perfumeRepository.delete(perfume);
  }
}
