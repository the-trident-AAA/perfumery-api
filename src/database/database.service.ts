import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from 'src/brand/entities/brand.entity';
import { Offer } from 'src/offer/entities/offer.entity';
import { PerfumeType } from 'src/perfume-type/entities/perfume-type.entity';
import { Perfume } from 'src/perfume/entities/perfume.entity';
import { Scent } from 'src/scent/entities/scent.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(PerfumeType)
    public readonly affectedPerfumeType: Repository<PerfumeType>,
    @InjectRepository(Brand)
    public readonly affectedBrand: Repository<Brand>,
    @InjectRepository(Scent)
    public readonly affectedScent: Repository<Scent>,
    @InjectRepository(Perfume)
    public readonly affectedPerfume: Repository<Perfume>,
    @InjectRepository(Offer)
    public readonly affectedOffer: Repository<Offer>,
  ) {}
}
