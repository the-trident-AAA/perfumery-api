import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandEntity } from 'src/brand/entities/brand.entity';
import { HomeBannerEntity } from 'src/home-banner/entities/home-banner.entity';
import { OfferEntity } from 'src/offer/entities/offer.entity';
import { OrderPerfumeEntity } from 'src/order/entities/order-perfume.entity';
import { OrderEntity } from 'src/order/entities/order.entity';
import { PerfumeTypeEntity } from 'src/perfume-type/entities/perfume-type.entity';
import { PerfumeEntity } from 'src/perfume/entities/perfume.entity';
import { ScentEntity } from 'src/scent/entities/scent.entity';
import { ShopCartPerfumeEntity } from 'src/shop-cart-perfume/entities/shop-cart-perfume.entity';
import { ShopCartEntity } from 'src/shop-cart/entities/shop-cart.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { OtpEntity } from 'src/otp/entities/otp.entity';
import { Repository } from 'typeorm';
import { TapeEntity } from 'src/tape/entities/tape.entity';

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
    @InjectRepository(ShopCartEntity)
    public readonly shopCartRespository: Repository<ShopCartEntity>,
    @InjectRepository(ShopCartPerfumeEntity)
    public readonly shopCartPerfumeRespository: Repository<ShopCartPerfumeEntity>,
    @InjectRepository(OrderEntity)
    public readonly orderRespository: Repository<OrderEntity>,
    @InjectRepository(OrderPerfumeEntity)
    public readonly orderPerfumeRepository: Repository<OrderPerfumeEntity>,
    @InjectRepository(OtpEntity)
    public readonly otpRepository: Repository<OtpEntity>,
    @InjectRepository(TapeEntity)
    public readonly tapeRepository: Repository<TapeEntity>,
  ) {}
}
