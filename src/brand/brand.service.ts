import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandEntity } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { BrandResponse } from './responses/brand.response';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
  ) {}

  async create(dto: CreateBrandDto) {
    const brand = this.brandRepository.create(dto);
    return await this.brandRepository.save(brand);
  }

  async findAll(): Promise<BrandResponse[]> {
    const brands = await this.brandRepository.find();
    return brands.map((brand) => new BrandResponse(brand.id, brand.name));
  }

  async findOne(id: string): Promise<BrandResponse> {
    const brand = await this.brandRepository.findOne({
      where: { id },
    });

    if (!brand) {
      throw new Error(`PerfumeGroup con ID ${id} no encontrado`);
    }

    return new BrandResponse(brand.id, brand.name);
  }

  async update(id: string, dto: UpdateBrandDto) {
    const brand = await this.findOne(id);
    Object.assign(brand, dto);

    return await this.brandRepository.save(brand);
  }

  async remove(id: string) {
    const brand = await this.findOne(id);
    return await this.brandRepository.delete(brand);
  }
}
