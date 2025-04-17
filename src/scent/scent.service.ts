import { Injectable } from '@nestjs/common';
import { CreateScentDto } from './dto/create-scent.dto';
import { UpdateScentDto } from './dto/update-scent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ScentEntity } from './entities/scent.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScentService {
  constructor(
    @InjectRepository(ScentEntity)
    private readonly scentRepository: Repository<ScentEntity>,
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
      throw new Error(`Scent con ID ${id} no encontrado`);
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
