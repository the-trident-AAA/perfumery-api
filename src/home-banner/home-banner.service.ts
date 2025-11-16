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
    // Upload the image of the home banner
    const image = await this.minioService.uploadFile(
      undefined,
      createHomeBannerDto.image.buffer,
      createHomeBannerDto.image.originalname.split('.').pop(),
      createHomeBannerDto.image.mimetype,
    );

    const mobileImage = await this.minioService.uploadFile(
      undefined,
      createHomeBannerDto.mobileImage.buffer,
      createHomeBannerDto.mobileImage.originalname.split('.').pop(),
      createHomeBannerDto.mobileImage.mimetype,
    );

    const homeBanner = this.db.homeBannerRepository.create({
      ...createHomeBannerDto,
      image,
      mobileImage,
      isMain: false,
      creationDate: new Date(),
    });

    return await this.db.homeBannerRepository.save(homeBanner);
  }

  async findAll(orderDto: OrderDto) {
    const { order, orderBy } = orderDto;

    const sortableFields = [
      'id',
      'title',
      'description',
      'isMain',
      'creationDate',
    ];
    const direction = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const orderClause: FindOptionsOrder<HomeBannerEntity> =
      orderBy && sortableFields.includes(orderBy)
        ? { [orderBy]: direction }
        : { creationDate: 'ASC' };

    const homeBanners = await this.db.homeBannerRepository.find({
      order: orderClause,
    });

    return homeBanners.map(
      (homeBanner) =>
        new HomeBannerResponse(
          homeBanner.id,
          homeBanner.title,
          homeBanner.description,
          homeBanner.buttonText,
          homeBanner.isMain,
          homeBanner.image
            ? this.minioService.getPublicUrl(homeBanner.image)
            : undefined,
          homeBanner.mobileImage
            ? this.minioService.getPublicUrl(homeBanner.mobileImage)
            : undefined,
          homeBanner.statisticalTips,
          homeBanner.infoTips,
          homeBanner.filters,
        ),
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

    return new HomeBannerDetailsResponse(
      homeBanner.id,
      homeBanner.title,
      homeBanner.description,
      homeBanner.buttonText,
      homeBanner.isMain,
      homeBanner.image
        ? this.minioService.getPublicUrl(homeBanner.image)
        : undefined,
      homeBanner.mobileImage
        ? this.minioService.getPublicUrl(homeBanner.mobileImage)
        : undefined,
      homeBanner.statisticalTips,
      homeBanner.infoTips,
      homeBanner.filters,
    );
  }

  async findMainHomeBanner() {
    const homeBanner = await this.db.homeBannerRepository.findOne({
      where: { isMain: true },
    });

    if (!homeBanner)
      throw new BadRequestException(
        'No existe un home banner con ese identificador',
      );

    return new HomeBannerDetailsResponse(
      homeBanner.id,
      homeBanner.title,
      homeBanner.description,
      homeBanner.buttonText,
      homeBanner.isMain,
      homeBanner.image
        ? this.minioService.getPublicUrl(homeBanner.image)
        : undefined,
      homeBanner.mobileImage
        ? this.minioService.getPublicUrl(homeBanner.mobileImage)
        : undefined,
      homeBanner.statisticalTips,
      homeBanner.infoTips,
      homeBanner.filters,
    );
  }

  async update(id: string, updateHomeBannerDto: UpdateHomeBannerDto) {
    const { image, mobileImage, ...restDTO } = updateHomeBannerDto;
    const homeBanner = await this.db.homeBannerRepository.findOne({
      where: { id },
    });
    Object.assign(homeBanner, {
      ...restDTO,
      infoTips: restDTO.infoTips || [],
      statisticalTips: restDTO.statisticalTips || [],
      filters: restDTO.filters || [],
    });

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

    if (mobileImage) {
      // delete the old mobile image from Minio
      await this.minioService.deleteFile(homeBanner.mobileImage);
      // upload the new mobile image
      const minioImage = await this.minioService.uploadFile(
        undefined,
        mobileImage.buffer,
        mobileImage.originalname.split('.').pop(),
        mobileImage.mimetype,
      );
      homeBanner.mobileImage = minioImage;
    }

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

    // delete the image from Minio
    await this.minioService.deleteFile(homeBanner.image);

    return await this.db.homeBannerRepository.delete({ id });
  }
}
