import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferResponse } from './responses/offer.response';
import { OfferDetailsResponse } from './responses/offer-details.response';
import { DatabaseService } from 'src/database/database.service';
import { MinioService } from 'src/minio/minio.service';
import { PerfumeService } from 'src/perfume/perfume.service';
import { FiltersOfferDto } from './dto/filters-offer.dto';
import { Between, FindOptionsOrder, ILike } from 'typeorm';
import { OfferEntity } from './entities/offer.entity';
import { OrderDto } from 'src/utils/dto/order.dto';

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
      mobileImage: dto.mobileImage
        ? await this.minioService.uploadFile(
            undefined,
            dto.mobileImage.buffer,
            dto.mobileImage.originalname.split('.').pop(),
            dto.mobileImage.mimetype,
          )
        : null,
    });

    return await this.db.offerRepository.save(offer);
  }

  async findAll(
    filtersOfferDto: FiltersOfferDto,
    orderDto: OrderDto,
  ): Promise<OfferResponse[]> {
    const { order, orderBy } = orderDto;
    const sortableFields = [
      'id',
      'name',
      'description',
      'scope',
      'discount',
      'offerType',
    ];
    const direction = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const orderClause: FindOptionsOrder<OfferEntity> =
      orderBy && sortableFields.includes(orderBy)
        ? { [orderBy]: direction }
        : { name: 'ASC' };

    const offers = await this.db.offerRepository.find({
      where: {
        ...(filtersOfferDto.name && {
          name: ILike(`%${filtersOfferDto.name}%`),
        }),
        ...(filtersOfferDto.description && {
          description: ILike(`%${filtersOfferDto.description}%`),
        }),
        ...(filtersOfferDto.offerType && {
          offerType: ILike(`%${filtersOfferDto.offerType}%`),
        }),
        ...(filtersOfferDto.scope && {
          scope: ILike(`%${filtersOfferDto.scope}%`),
        }),
        // ✅ Rango para discount
        ...((filtersOfferDto.minDiscount !== undefined ||
          filtersOfferDto.maxDiscount !== undefined) && {
          discount: Between(
            filtersOfferDto.minDiscount ?? 0,
            filtersOfferDto.maxDiscount ?? Number.MAX_SAFE_INTEGER,
          ),
        }),
      },
      order: orderClause,
    });
    return offers.map(
      (offer) =>
        new OfferResponse(
          offer.id,
          offer.discount,
          offer.offerType,
          offer.name,
          offer.description,
          offer.scope,
          offer.image ? this.minioService.getPublicUrl(offer.image) : undefined,
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
      offer.image ? this.minioService.getPublicUrl(offer.image) : undefined,
    );
  }

  async update(id: string, dto: UpdateOfferDto) {
    const { image, mobileImage, ...restDTO } = dto;
    const offer = await this.db.offerRepository.findOne({
      where: {
        id,
      },
    });

    if (!offer)
      throw new BadRequestException(
        'No existe una oferta con ese identificador',
      );

    Object.assign(offer, restDTO);

    if (offer.image)
      // delete the old image from Minio
      await this.minioService.deleteFile(offer.image);
    if (offer.mobileImage)
      // delete the old mobile image from Minio
      await this.minioService.deleteFile(offer.mobileImage);

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

    if (mobileImage) {
      // upload the new mobile image
      const minioImage = await this.minioService.uploadFile(
        undefined,
        mobileImage.buffer,
        mobileImage.originalname.split('.').pop(),
        mobileImage.mimetype,
      );
      offer.mobileImage = minioImage;
    } else {
      offer.mobileImage = null;
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
