import { Injectable } from '@nestjs/common';
import { CreatePerfumeDto } from './dto/create-perfume.dto';
import { UpdatePerfumeDto } from './dto/update-perfume.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PerfumeEntity } from './entities/perfume.entity';
import { In, Repository } from 'typeorm';
import { error } from 'console';
import { PerfumeResponse } from './responses/perfume.response';
import { ScentEntity } from 'src/scent/entities/scent.entity';
import { PerfumeDetailsResponse } from './responses/perfume-details.response';
import { BrandResponse } from 'src/brand/responses/brand.response';
import { ScentResponse } from 'src/scent/responses/scent.response';
import { PerfumeTypeResponse } from 'src/perfume-type/responses/perfume-type.response';
import { OfferResponse } from 'src/offer/responses/offer.response';

@Injectable()
export class PerfumeService {
  constructor(
    @InjectRepository(PerfumeEntity)
    private readonly perfumeRepository: Repository<PerfumeEntity>,

    @InjectRepository(ScentEntity)
    private readonly scentRepository: Repository<ScentEntity>,
  ) {}

  async create(dto: CreatePerfumeDto) {
    // Search for ScentEntity objects from the received IDs
    const scents = await this.scentRepository.findBy({
      id: In(dto.scentsId),
    });

    const perfume = this.perfumeRepository.create({
      ...dto,
      scents,
    });

    return await this.perfumeRepository.save(perfume);
  }

  async findAll(): Promise<PerfumeResponse[]> {
    const perfumes = await this.perfumeRepository.find({
      relations: ['brand', 'perfumeType', 'scents'],
    });
    return perfumes.map(
      (perfume) =>
        new PerfumeResponse(
          perfume.id,
          perfume.name,
          perfume.brand.name,
          perfume.gender,
          perfume.scents.map((scent) => scent.name),
          perfume.liters,
          perfume.perfumeType.name,
          perfume.available,
          perfume.price,
          perfume.cant,
          perfume.offer ? perfume.offer.discount : null,
        ),
    );
  }

  async findOne(id: string) {
    const perfume = await this.perfumeRepository.findOne({
      where: { id },
      relations: ['brand', 'perfumeType', 'scents'],
    });

    if (!perfume) {
      throw new Error(`Perfume con ID ${id} no encontrado`);
    }

    return new PerfumeDetailsResponse(
      perfume.id,
      perfume.name,
      new BrandResponse(perfume.brand.id, perfume.brand.name),
      perfume.gender,
      perfume.scents.map((scent) => new ScentResponse(scent.id, scent.name)),
      perfume.liters,
      new PerfumeTypeResponse(perfume.perfumeType.id, perfume.perfumeType.name),
      perfume.available,
      perfume.price,
      perfume.cant,
      perfume.offer
        ? new OfferResponse(
            perfume.offer.id,
            perfume.offer.discount,
            perfume.offer.offerType,
          )
        : null,
    );
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
