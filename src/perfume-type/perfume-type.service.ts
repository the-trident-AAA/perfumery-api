import { Injectable } from '@nestjs/common';
import { CreatePerfumeTypeDto } from './dto/create-perfume-type.dto';
import { UpdatePerfumeTypeDto } from './dto/update-perfume-type.dto';
import { PerfumeTypeResponse } from './responses/perfume-type.response';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PerfumeTypeService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreatePerfumeTypeDto) {
    const perfumeType = this.db.perfumeTypeRepository.create(dto);
    return await this.db.perfumeTypeRepository.save(perfumeType);
  }

  async findAll(): Promise<PerfumeTypeResponse[]> {
    const perfumeTypes = await this.db.perfumeTypeRepository.find();
    return perfumeTypes.map(
      (perfumeType) =>
        new PerfumeTypeResponse(perfumeType.id, perfumeType.name),
    );
  }

  async findOne(id: string) {
    const perfumeType = await this.db.perfumeTypeRepository.findOne({
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

    return await this.db.perfumeTypeRepository.save(perfumeType);
  }

  async remove(id: string) {
    const perfumeType = await this.findOne(id);
    return await this.db.perfumeTypeRepository.delete(perfumeType);
  }
}
