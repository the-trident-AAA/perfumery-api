import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferResponse } from './responses/offer.response';
import { OfferDetailsResponse } from './responses/offer-details.response';
import { DatabaseService } from 'src/database/database.service';
import { MinioService } from 'src/minio/minio.service';
import { PerfumeService } from 'src/perfume/perfume.service';

@Injectable()
export class OfferService {
  constructor(
    private readonly db: DatabaseService,
    private readonly minioService: MinioService,
    private readonly perfumeService: PerfumeService,
  ) {}

  async create(dto: CreateOfferDto) {
    const offer = this.db.offerRepository.create({
      ...dto,
      image: dto.image
        ? await this.minioService.uploadFile(
            undefined,
            dto.image.buffer,
            dto.image.originalname.split('.').pop(),
            dto.image.mimetype,
          )
        : null,
    });

    return await this.db.offerRepository.save(offer);
  }

  async findAll(): Promise<OfferResponse[]> {
    const offers = await this.db.offerRepository.find();
    return Promise.all(
      offers.map(async (offer) => {
        const image = offer.image
          ? await this.minioService.getPresignedUrl(offer.image)
          : null;
        return new OfferResponse(
          offer.id,
          offer.discount,
          offer.offerType,
          offer.name,
          offer.description,
          offer.scope,
          image,
        );
      }),
    );
  }

  async findOne(id: string): Promise<OfferDetailsResponse> {
    const offer = await this.db.offerRepository.findOne({
      where: { id },
    });

    if (!offer) {
      throw new Error(`offer con ID ${id} no encontrado`);
    }

    const image = offer.image
      ? await this.minioService.getPresignedUrl(offer.image)
      : null;

    return new OfferDetailsResponse(
      offer.id,
      offer.discount,
      offer.offerType,
      offer.name,
      offer.description,
      offer.scope,
      image,
    );
  }

  async update(id: string, dto: UpdateOfferDto) {
    const { image, ...restDTO } = dto;
    const offer = await this.findOne(id);
    Object.assign(offer, restDTO);

    if (offer.image)
      // delete the old image from Minio
      await this.minioService.deleteFile(offer.image);

    if (image) {
      // upload the new image
      const minioImage = await this.minioService.uploadFile(
        undefined,
        image.buffer,
        image.originalname.split('.').pop(),
        image.mimetype,
      );
      offer.image = minioImage;
    } else {
      offer.image = null;
    }

    // update the associated perfumes
    await this.perfumeService.updateAssociatedPerfumesToOffer(id, dto.discount);

    return await this.db.offerRepository.save(offer);
  }

  async remove(id: string) {
    const offer = await this.findOne(id);

    if (!offer)
      throw new BadRequestException('No se encontró una oferta con ese ID');

    // update the associated perfumes
    await this.perfumeService.updateAssociatedPerfumesToDeleteOffer(id);

    if (offer.image)
      // delete the image from Minio
      await this.minioService.deleteFile(offer.image);

    return await this.db.offerRepository.delete({ id });
  }
}
