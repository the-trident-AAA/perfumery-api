import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OfferEntity } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { OfferResponse } from './responses/offer.response';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(OfferEntity)
    private readonly offerRepository: Repository<OfferEntity>,
  ) {}

  async create(dto: CreateOfferDto) {
    const offer = this.offerRepository.create(dto);
    return await this.offerRepository.save(offer);
  }

  async findAll(): Promise<OfferResponse[]> {
    const offers = await this.offerRepository.find();
    return offers.map(
      (offer) => new OfferResponse(offer.id, offer.discount, offer.offerType),
    );
  }

  async findOne(id: string): Promise<OfferResponse> {
    const offer = await this.offerRepository.findOne({
      where: { id },
    });

    if (!offer) {
      throw new Error(`offer con ID ${id} no encontrado`);
    }

    return new OfferResponse(offer.id, offer.discount, offer.offerType);
  }

  async update(id: string, dto: UpdateOfferDto) {
    const offer = await this.findOne(id);
    Object.assign(offer, dto);

    return await this.offerRepository.save(offer);
  }

  async remove(id: string) {
    const offer = await this.findOne(id);
    return await this.offerRepository.delete(offer);
  }
}
