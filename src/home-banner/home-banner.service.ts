import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHomeBannerDto } from './dto/create-home-banner.dto';
import { UpdateHomeBannerDto } from './dto/update-home-banner.dto';
import { HomeBannerResponse } from './responses/home-banner.response';
import { HomeBannerDetailsResponse } from './responses/home-banner-details.response';
import { PerfumeService } from 'src/perfume/perfume.service';
import { PerfumeEntity } from 'src/perfume/entities/perfume.entity';
import { MinioService } from 'src/minio/minio.service';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class HomeBannerService {
  constructor(
    private readonly db: DatabaseService,
    private readonly perfumeService: PerfumeService,
    private readonly minioService: MinioService,
  ) {}
  async create(createHomeBannerDto: CreateHomeBannerDto) {
    // Upload the image of the perfume
    const image = await this.minioService.uploadFile(
      undefined,
      createHomeBannerDto.image.buffer,
      createHomeBannerDto.image.originalname.split('.').pop(),
      createHomeBannerDto.image.mimetype,
    );

    const homeBanner = this.db.homeBannerRepository.create({
      ...createHomeBannerDto,
      perfumes: createHomeBannerDto.perfumes
        ? createHomeBannerDto.perfumes.map((perfume) => ({
            id: perfume,
          }))
        : [],
      image: image,
    });

    return await this.db.homeBannerRepository.save(homeBanner);
  }

  async findAll() {
    const homeBanners = await this.db.homeBannerRepository.find();
    return Promise.all(
      homeBanners.map(async (homeBanner) => {
        const image = homeBanner.image
          ? await this.minioService.getPresignedUrl(homeBanner.image)
          : null;
        return new HomeBannerResponse(
          homeBanner.id,
          homeBanner.title,
          homeBanner.description,
          image,
        );
      }),
    );
  }

  async findOne(id: string) {
    const homeBanner = await this.db.homeBannerRepository.findOne({
      where: { id },
      relations: ['perfumes'],
    });
    if (!homeBanner)
      throw new BadRequestException(
        'No existe un home banner con ese identificador',
      );

    const image = homeBanner.image
      ? await this.minioService.getPresignedUrl(homeBanner.image)
      : null;

    return new HomeBannerDetailsResponse(
      homeBanner.id,
      homeBanner.title,
      homeBanner.description,
      image,
      await Promise.all(
        homeBanner.perfumes.map(
          async (perfume) => await this.perfumeService.findOne(perfume.id),
        ),
      ),
    );
  }

  async update(id: string, updateHomeBannerDto: UpdateHomeBannerDto) {
    const { image, ...restDTO } = updateHomeBannerDto;
    const homeBanner = await this.db.homeBannerRepository.findOne({
      where: { id },
    });
    Object.assign(homeBanner, restDTO);
    homeBanner.perfumes = updateHomeBannerDto.perfumes
      ? updateHomeBannerDto.perfumes.map(
          (perfume) =>
            ({
              id: perfume,
            }) as PerfumeEntity,
        )
      : [];

    if (image) {
      // delete the old image from Minio
      await this.minioService.deleteFile(homeBanner.image);
      // upload the new image
      const minioImage = await this.minioService.uploadFile(
        undefined,
        image.buffer,
        image.originalname.split('.').pop(),
        image.mimetype,
      );
      homeBanner.image = minioImage;
    }

    return await this.db.homeBannerRepository.save(homeBanner);
  }

  async remove(id: string) {
    const homeBanner = await this.db.homeBannerRepository.findOne({
      where: { id },
    });

    if (!homeBanner)
      throw new BadRequestException('No existe un home banner con ese id');

    // delete the image from Minio
    await this.minioService.deleteFile(homeBanner.image);
    return await this.db.homeBannerRepository.delete({ id });
  }
}
