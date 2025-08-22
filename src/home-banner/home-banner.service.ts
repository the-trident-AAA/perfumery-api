import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHomeBannerDto } from './dto/create-home-banner.dto';
import { UpdateHomeBannerDto } from './dto/update-home-banner.dto';
import { HomeBannerResponse } from './responses/home-banner.response';
import { HomeBannerDetailsResponse } from './responses/home-banner-details.response';
import { MinioService } from 'src/minio/minio.service';
import { DatabaseService } from 'src/database/database.service';
import { OrderDto } from 'src/utils/dto/order.dto';
import { FindOptionsOrder } from 'typeorm';
import { HomeBannerEntity } from './entities/home-banner.entity';

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
      isMain: false,
    });

    return await this.db.homeBannerRepository.save(homeBanner);
  }

  async findAll(orderDto: OrderDto) {
    const { order, orderBy } = orderDto;

    const sortableFields = ['id', 'title', 'description', 'isMain'];
    const direction = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const orderClause: FindOptionsOrder<HomeBannerEntity> =
      orderBy && sortableFields.includes(orderBy)
        ? { [orderBy]: direction }
        : { title: 'ASC' };

    const homeBanners = await this.db.homeBannerRepository.find({
      order: orderClause,
    });

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
          homeBanner.isMain,
          images,
          homeBanner.statisticalTips,
          homeBanner.infoTips,
        );
      }),
    );
  }

  async findOne(id: string) {
    const homeBanner = await this.db.homeBannerRepository.findOne({
      where: { id },
    });
    console.log(homeBanner);
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
      homeBanner.isMain,
      images,
      homeBanner.statisticalTips,
      homeBanner.infoTips,
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

  async markedAsMainHomeBanner(id: string) {
    const homeBanner = await this.db.homeBannerRepository.findOne({
      where: { id },
    });

    if (!homeBanner)
      throw new BadRequestException(
        'No existe un home banner con ese identificador',
      );

    if (homeBanner.isMain) homeBanner.isMain = false;
    else {
      // find the last principal home banner
      const lastPrincipalHomeBanner =
        await this.db.homeBannerRepository.findOne({
          where: {
            isMain: true,
          },
        });
      if (lastPrincipalHomeBanner && lastPrincipalHomeBanner.id !== id) {
        lastPrincipalHomeBanner.isMain = false;
        await this.db.homeBannerRepository.save(lastPrincipalHomeBanner);
      }
      homeBanner.isMain = true;
    }

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
