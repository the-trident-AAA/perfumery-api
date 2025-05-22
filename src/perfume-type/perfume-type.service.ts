import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePerfumeTypeDto } from './dto/create-perfume-type.dto';
import { UpdatePerfumeTypeDto } from './dto/update-perfume-type.dto';
import { PerfumeTypeResponse } from './responses/perfume-type.response';
import { DatabaseService } from 'src/database/database.service';
import { MinioService } from 'src/minio/minio.service';

@Injectable()
export class PerfumeTypeService {
  constructor(
    private readonly db: DatabaseService,
    private readonly minioService: MinioService,
  ) {}

  async create(dto: CreatePerfumeTypeDto) {
    const perfumeType = this.db.perfumeTypeRepository.create({
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
    return await this.db.perfumeTypeRepository.save(perfumeType);
  }

  async findAll(): Promise<PerfumeTypeResponse[]> {
    const perfumeTypes = await this.db.perfumeTypeRepository.find();
    return await Promise.all(
      perfumeTypes.map(async (perfumeType) => {
        const image = perfumeType.image
          ? await this.minioService.getPresignedUrl(perfumeType.image)
          : null;
        return new PerfumeTypeResponse(perfumeType.id, perfumeType.name, image);
      }),
    );
  }

  async findOne(id: string) {
    const perfumeType = await this.db.perfumeTypeRepository.findOne({
      where: { id },
    });

    if (!perfumeType) {
      throw new Error(`PerfumeType con ID ${id} no encontrado`);
    }

    return new PerfumeTypeResponse(
      perfumeType.id,
      perfumeType.name,
      perfumeType.image
        ? await this.minioService.getPresignedUrl(perfumeType.image)
        : null,
    );
  }

  async update(id: string, dto: UpdatePerfumeTypeDto) {
    const { image, ...restDTO } = dto;
    const perfumeType = await this.findOne(id);
    Object.assign(perfumeType, restDTO);

    if (perfumeType.image)
      // delete the old image from Minio
      await this.minioService.deleteFile(perfumeType.image);

    if (image) {
      // upload the new image
      const minioImage = await this.minioService.uploadFile(
        undefined,
        image.buffer,
        image.originalname.split('.').pop(),
        image.mimetype,
      );
      perfumeType.image = minioImage;
    } else {
      perfumeType.image = null;
    }

    return await this.db.perfumeTypeRepository.save(perfumeType);
  }

  async remove(id: string) {
    const perfumeType = await this.findOne(id);

    if (!perfumeType)
      throw new BadRequestException(
        'No existe un tipo de perfume con ese identificador',
      );

    if (perfumeType.image)
      // delete the old image from Minio
      await this.minioService.deleteFile(perfumeType.image);

    return await this.db.perfumeTypeRepository.delete({ id });
  }
}
