import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferResponse } from './responses/offer.response';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OfferService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateOfferDto) {
    const offer = this.db.offerRepository.create(dto);
    return await this.db.offerRepository.save(offer);
  }

  async findAll(): Promise<OfferResponse[]> {
    const offers = await this.db.offerRepository.find();
    return offers.map(
      (offer) =>
        new OfferResponse(
          offer.id,
          offer.discount,
          offer.offerType,
          offer.name,
          offer.description,
          offer.scope,
        ),
    );
  }

  async findOne(id: string): Promise<OfferResponse> {
    const offer = await this.db.offerRepository.findOne({
      where: { id },
    });

    if (!offer) {
      throw new Error(`offer con ID ${id} no encontrado`);
    }

    return new OfferResponse(
      offer.id,
      offer.discount,
      offer.offerType,
      offer.name,
      offer.description,
      offer.scope,
    );
  }

  async update(id: string, dto: UpdateOfferDto) {
    const offer = await this.findOne(id);
    Object.assign(offer, dto);

    return await this.db.offerRepository.save(offer);
  }

  async remove(id: string) {
    const offer = await this.findOne(id);
    return await this.db.offerRepository.delete(offer);
  }
}
