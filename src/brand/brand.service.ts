import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandResponse } from './responses/brand.response';
import { DatabaseService } from 'src/database/database.service';
import { FiltersBrandDto } from './dto/filters-brand.dto';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { PaginationMeta, PagintationResponse } from 'src/utils/api-responses';
import { ILike } from 'typeorm';

@Injectable()
export class BrandService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateBrandDto) {
    const brandEntity = await this.db.brandRepository.findOne({
      where: {
        name: dto.name,
      },
    });

    if (brandEntity)
      throw new BadRequestException('Ya existe una marca con ese nombre');

    const brand = this.db.brandRepository.create(dto);
    return await this.db.brandRepository.save(brand);
  }

  async findAll(filtersBrandDto: FiltersBrandDto) {
    const [brands, total] = await this.db.brandRepository.findAndCount({
      where: {
        ...(filtersBrandDto.id && { id: filtersBrandDto.id }),
        ...(filtersBrandDto.name && {
          name: ILike(`%${filtersBrandDto.name}%`),
        }),
      },
    });

    const brandResponses = brands.map(
      (brand) => new BrandResponse(brand.id, brand.name),
    );

    return brandResponses;
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

    if (!brand)
      throw new BadRequestException(
        'No existe una marca con ese identificador',
      );

    const brandByName = await this.db.brandRepository.findOne({
      where: {
        name: dto.name,
      },
    });

    if (brandByName && brandByName.id !== id)
      throw new BadRequestException('Ya existe una marca con ese nombre');

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
