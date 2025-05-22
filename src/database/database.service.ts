import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandEntity } from 'src/brand/entities/brand.entity';
import { HomeBannerEntity } from 'src/home-banner/entities/home-banner.entity';
import { OfferEntity } from 'src/offer/entities/offer.entity';
import { PerfumeTypeEntity } from 'src/perfume-type/entities/perfume-type.entity';
import { PerfumeEntity } from 'src/perfume/entities/perfume.entity';
import { ScentEntity } from 'src/scent/entities/scent.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(PerfumeTypeEntity)
    public readonly perfumeTypeRepository: Repository<PerfumeTypeEntity>,
    @InjectRepository(BrandEntity)
    public readonly brandRepository: Repository<BrandEntity>,
    @InjectRepository(ScentEntity)
    public readonly scentRepository: Repository<ScentEntity>,
    @InjectRepository(PerfumeEntity)
    public readonly perfumeRepository: Repository<PerfumeEntity>,
    @InjectRepository(OfferEntity)
    public readonly offerRepository: Repository<OfferEntity>,
    @InjectRepository(HomeBannerEntity)
    public readonly homeBannerRepository: Repository<HomeBannerEntity>,
    @InjectRepository(UserEntity)
    public readonly userRepository: Repository<UserEntity>,
  ) {}
}
