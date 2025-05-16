import { Injectable } from '@nestjs/common';
import { CreatePerfumeDto } from './dto/create-perfume.dto';
import { UpdatePerfumeDto } from './dto/update-perfume.dto';
import { In } from 'typeorm';
import { PerfumeResponse } from './responses/perfume.response';
import { PerfumeDetailsResponse } from './responses/perfume-details.response';
import { BrandResponse } from 'src/brand/responses/brand.response';
import { ScentResponse } from 'src/scent/responses/scent.response';
import { PerfumeTypeResponse } from 'src/perfume-type/responses/perfume-type.response';
import { OfferResponse } from 'src/offer/responses/offer.response';
import { MinioService } from 'src/minio/minio.service';
import { DatabaseService } from 'src/database/database.service';
import { OfferDetailsResponse } from 'src/offer/responses/offer-details.response';


@Injectable()
export class PerfumeService {
  constructor(
    private readonly db: DatabaseService,
    private readonly minioService: MinioService,
  ) {}

  async create(dto: CreatePerfumeDto) {
    // Search for ScentEntity objects from the received IDs
    const scents = await this.db.scentRepository.findBy({
      id: In(dto.scentsId),
    });
    // Upload the image of the perfume
    const image = await this.minioService.uploadFile(
      undefined,
      dto.image.buffer,
      dto.image.originalname.split('.').pop(),
      dto.image.mimetype,
    );

    const perfume = this.db.perfumeRepository.create({
      ...dto,
      scents,
      image: this.minioService.getMinioURL() + image,
    });

    return await this.db.perfumeRepository.save(perfume);
  }

  async findAll(): Promise<PerfumeResponse[]> {
    const perfumes = await this.db.perfumeRepository.find({
      relations: ['brand', 'perfumeType', 'scents', 'offer'],
    });

    const data = await Promise.all(
      perfumes.map(async (perfume) => {
        const image = perfume.image
          ? await this.minioService.getPresignedUrl(perfume.image)
          : null;

        return new PerfumeResponse(
          perfume.id,
          perfume.name,
          perfume.description,
          perfume.image,
          perfume.brand.name,
          perfume.gender,
          perfume.scents.map((scent) => scent.name),
          perfume.milliliters,
          perfume.perfumeType.name,
          perfume.available,
          perfume.price,
          perfume.cant,
          image,
          perfume.offer ? perfume.offer.discount : null,
        );
      }),
    );

    return data;
  }

  async findOne(id: string) {
    const perfume = await this.db.perfumeRepository.findOne({
      where: { id },
      relations: ['brand', 'perfumeType', 'scents', 'offer'],
    });

    if (!perfume) {
      throw new Error(`Perfume con ID ${id} no encontrado`);
    }

    return new PerfumeDetailsResponse(
      perfume.id,
      perfume.name,
      perfume.description,
      perfume.image,
      new BrandResponse(perfume.brand.id, perfume.brand.name),
      perfume.gender,
      perfume.scents.map((scent) => new ScentResponse(scent.id, scent.name)),
      perfume.milliliters,
      new PerfumeTypeResponse(perfume.perfumeType.id, perfume.perfumeType.name),
      perfume.available,
      perfume.price,
      perfume.cant,
      (perfume.image = await this.minioService.getPresignedUrl(perfume.image)),
      perfume.offer
        ? new OfferDetailsResponse(
            perfume.offer.id,
            perfume.offer.discount,
            perfume.offer.offerType,
            perfume.offer.name,
            perfume.offer.description,
            perfume.offer.scope,
            perfume.offer.image,
          )
        : null,
    );
  }

  async update(id: string, dto: UpdatePerfumeDto) {
    const { image, ...restDTO } = dto;
    const perfume = await this.db.perfumeRepository.findOne({ where: { id } });
    Object.assign(perfume, restDTO);

    // removed defined relations marked as "undefined"
    if (!dto.offerId) {
      perfume.offerId = null;
    }
    if (image) {
      // delete the old image from Minio
      await this.minioService.deleteFile(perfume.image.split('/').pop());
      // upload the new image
      const minioImage = await this.minioService.uploadFile(
        undefined,
        image.buffer,
        image.originalname.split('.').pop(),
        image.mimetype,
      );
      perfume.image = this.minioService.getMinioURL() + minioImage;
    }

    return await this.db.perfumeRepository.save(perfume);
  }

  async remove(id: string) {
    const perfume = await this.findOne(id);

    if (!perfume) throw new Error('Perfume no encontrado');

    // delete the image from Minio
    await this.minioService.deleteFile(perfume.image.split('/').pop());

    // delete relationships in the intermediate table perfume_scent
    await this.db.perfumeRepository.query(
      `DELETE FROM perfume_scent WHERE perfume_id = $1`,
      [id],
    );

    return await this.db.perfumeRepository.delete(id);
  }
}
