import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferResponse } from './responses/offer.response';

import { OfferDetailsResponse } from './responses/offer-details.response';
import { DatabaseService } from 'src/database/database.service';
import { MinioService } from 'src/minio/minio.service';

@Injectable()
export class OfferService {
  constructor(
    private readonly db: DatabaseService,
    private readonly minioService: MinioService,
  ) {}

  async create(dto: CreateOfferDto) {
    const offer = this.db.offerRepository.create({
      ...dto,
      image: dto.image
        ? this.minioService.getMinioURL() +
          (await this.minioService.uploadFile(
            undefined,
            dto.image.buffer,
            dto.image.originalname.split('.').pop(),
            dto.image.mimetype,
          ))
        : null,
    });

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
          offer.image,
        ),
    );
  }

  async findOne(id: string): Promise<OfferDetailsResponse> {
    const offer = await this.db.offerRepository.findOne({
      where: { id },
    });

    if (!offer) {
      throw new Error(`offer con ID ${id} no encontrado`);
    }

    return new OfferDetailsResponse(
      offer.id,
      offer.discount,
      offer.offerType,
      offer.name,
      offer.description,
      offer.scope,
      offer.image,
    );
  }

  async update(id: string, dto: UpdateOfferDto) {
    const { image, ...restDTO } = dto;
    const offer = await this.findOne(id);
    Object.assign(offer, restDTO);

    if (image) {
      // delete the old image from Minio
      await this.minioService.deleteFile(offer.image.split('/').pop());
      // upload the new image
      const minioImage = await this.minioService.uploadFile(
        undefined,
        image.buffer,
        image.originalname.split('.').pop(),
        image.mimetype,
      );
      offer.image = this.minioService.getMinioURL() + minioImage;
    }

    return await this.db.offerRepository.save(offer);
  }

  async remove(id: string) {
    const offer = await this.findOne(id);
    return await this.db.offerRepository.delete(offer);
  }
}
