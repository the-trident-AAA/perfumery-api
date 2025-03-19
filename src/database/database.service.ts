import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from 'src/brand/entities/brand.entity';
import { PerfumeGroup } from 'src/perfume-group/entities/perfume-group.entity';
import { Perfume } from 'src/perfume/entities/perfume.entity';
import { Scent } from 'src/scent/entities/scent.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(PerfumeGroup)
    public readonly affectedPerfumeGroup: Repository<PerfumeGroup>,
    @InjectRepository(Brand)
    public readonly affectedBrand: Repository<Brand>,
    @InjectRepository(Scent)
    public readonly affectedScent: Repository<Scent>,
    @InjectRepository(Perfume)
    public readonly affectedPerfume: Repository<Perfume>,
  ) {}
}
