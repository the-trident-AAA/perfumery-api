import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from 'src/brand/entities/brand.entity';
import { PerfumeGroup } from 'src/perfume_group/entities/perfume_group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(PerfumeGroup)
    public readonly affectedPerfumeGroup: Repository<PerfumeGroup>,
    @InjectRepository(Brand)
    public readonly affectedBrand: Repository<PerfumeGroup>,
  ) {}
}
