import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHomeBannerDto } from './dto/create-home-banner.dto';
import { UpdateHomeBannerDto } from './dto/update-home-banner.dto';
import { HomeBannerResponse } from './responses/home-banner.response';
import { HomeBannerDetailsResponse } from './responses/home-banner-details.response';
import { MinioService } from 'src/minio/minio.service';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class HomeBannerService {
  constructor(
    private readonly db: DatabaseService,
    private readonly minioService: MinioService,
  ) {}
  async create(createHomeBannerDto: CreateHomeBannerDto) {
    // Upload the images of the perfume
    const images = await Promise.all(
      createHomeBannerDto.images.map(
        async (image) =>
          await this.minioService.uploadFile(
            undefined,
            image.buffer,
            image.originalname.split('.').pop(),
            image.mimetype,
          ),
      ),
    );
    const homeBanner = this.db.homeBannerRepository.create({
      ...createHomeBannerDto,
      images: images,
    });

    return await this.db.homeBannerRepository.save(homeBanner);
  }

  async findAll() {
    const homeBanners = await this.db.homeBannerRepository.find();

    return Promise.all(
      homeBanners.map(async (homeBanner) => {
        const images = await Promise.all(
          homeBanner.images.map(
            async (image) => await this.minioService.getPresignedUrl(image),
          ),
        );
        return new HomeBannerResponse(
          homeBanner.id,
          homeBanner.title,
          homeBanner.description,
          images,
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

    const images = await Promise.all(
      homeBanner.images.map(
        async (image) => await this.minioService.getPresignedUrl(image),
      ),
    );

    return new HomeBannerDetailsResponse(
      homeBanner.id,
      homeBanner.title,
      homeBanner.description,
      images,
    );
  }

  async update(id: string, updateHomeBannerDto: UpdateHomeBannerDto) {
    const { images, ...restDTO } = updateHomeBannerDto;
    const homeBanner = await this.db.homeBannerRepository.findOne({
      where: { id },
    });
    Object.assign(homeBanner, restDTO);

    if (images && images.length > 0) {
      // upload the new images
      const imagesMinio = await Promise.all(
        images.map(
          async (image) =>
            await this.minioService.uploadFile(
              undefined,
              image.buffer,
              image.originalname.split('.').pop(),
              image.mimetype,
            ),
        ),
      );
      homeBanner.images = imagesMinio;
    } else homeBanner.images = [];

    return await this.db.homeBannerRepository.save(homeBanner);
  }

  async remove(id: string) {
    const homeBanner = await this.db.homeBannerRepository.findOne({
      where: { id },
    });

    if (!homeBanner)
      throw new BadRequestException('No existe un home banner con ese id');

    // delete the images from Minio
    await Promise.all(
      homeBanner.images.map(
        async (image) => await this.minioService.deleteFile(image),
      ),
    );

    return await this.db.homeBannerRepository.delete({ id });
  }
}
