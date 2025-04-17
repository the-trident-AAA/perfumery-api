import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferEntity } from './entities/offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OfferEntity])],
  controllers: [OfferController],
  providers: [OfferService],
})
export class OfferModule {}
