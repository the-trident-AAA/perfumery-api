import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async create(dto: CreateBrandDto) {
    const brand = this.brandRepository.create(dto);
    return await this.brandRepository.save(brand);
  }

  async findAll() {
    return await this.brandRepository.find();
  }

  async findOne(id: number) {
    const brand = await this.brandRepository.findOne({
      where: { id },
    });

    if (!brand) {
      throw new Error(`PerfumeGroup con ID ${id} no encontrado`);
    }

    return brand;
  }

  async update(id: number, dto: UpdateBrandDto) {
    const brand = await this.findOne(id);
    Object.assign(brand, dto);

    return await this.brandRepository.save(brand);
  }

  async remove(id: number) {
    const brand = await this.findOne(id);
    return await this.brandRepository.delete(id);
  }
}
