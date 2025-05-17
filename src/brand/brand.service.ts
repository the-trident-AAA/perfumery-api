import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandResponse } from './responses/brand.response';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BrandService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateBrandDto) {
    const brand = this.db.brandRepository.create(dto);
    return await this.db.brandRepository.save(brand);
  }

  async findAll(): Promise<BrandResponse[]> {
    const brands = await this.db.brandRepository.find();
    return brands.map((brand) => new BrandResponse(brand.id, brand.name));
  }

  async findOne(id: string): Promise<BrandResponse> {
    const brand = await this.db.brandRepository.findOne({
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

    return await this.db.brandRepository.save(brand);
  }

  async remove(id: string) {
    const brand = await this.findOne(id);

    if (!brand)
      throw new BadRequestException(
        'No existe una marca con ese identificador',
      );

    return await this.db.brandRepository.delete({ id });
  }
}
