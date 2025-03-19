import { Injectable } from '@nestjs/common';
import { CreateScentDto } from './dto/create-scent.dto';
import { UpdateScentDto } from './dto/update-scent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Scent } from './entities/scent.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScentService {
  constructor(
    @InjectRepository(Scent)
    private readonly scentRepository: Repository<Scent>,
  ) {}

  async create(dto: CreateScentDto) {
    const scent = this.scentRepository.create(dto);
    return await this.scentRepository.save(scent);
  }

  async findAll() {
    return await this.scentRepository.find();
  }

  async findOne(id: number) {
    const scent = await this.scentRepository.findOne({
      where: { id },
    });

    if (!scent) {
      throw new Error(`PerfumeGroup con ID ${id} no encontrado`);
    }

    return scent;
  }

  async update(id: number, dto: UpdateScentDto) {
    const scent = await this.findOne(id);
    Object.assign(scent, dto);

    return await this.scentRepository.save(scent);
  }

  async remove(id: number) {
    const scent = await this.findOne(id);
    return await this.scentRepository.save(scent);
  }
}
