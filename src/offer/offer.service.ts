import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OfferEntity } from './entities/offer.entity';
import { Repository } from 'typeorm';

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

  async findAll() {
    return await this.offerRepository.find();
  }

  async findOne(id: string) {
    const offer = await this.offerRepository.findOne({
      where: { id },
    });

    if (!offer) {
      throw new Error(`offer con ID ${id} no encontrado`);
    }

    return offer;
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
