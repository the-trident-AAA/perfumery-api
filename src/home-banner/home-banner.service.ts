import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHomeBannerDto } from './dto/create-home-banner.dto';
import { UpdateHomeBannerDto } from './dto/update-home-banner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeBannerEntity } from './entities/home-banner.entity';
import { Repository } from 'typeorm';
import { HomeBannerResponse } from './responses/home-banner.response';
import { HomeBannerDetailsResponse } from './responses/home-banner-details.response';
import { PerfumeService } from 'src/perfume/perfume.service';

@Injectable()
export class HomeBannerService {
  constructor(
    @InjectRepository(HomeBannerEntity)
    private readonly homeBannerRepository: Repository<HomeBannerEntity>,
    private readonly perfumeService: PerfumeService,
  ) {}
  async create(createHomeBannerDto: CreateHomeBannerDto) {
    const homeBanner = this.homeBannerRepository.create({
      ...createHomeBannerDto,
      perfumes: createHomeBannerDto.perfumes.map((perfume) => ({
        id: perfume,
      })),
    });
    return await this.homeBannerRepository.save(homeBanner);
  }

  async findAll() {
    const homeBanners = await this.homeBannerRepository.find();
    return homeBanners.map(
      (homeBanner) =>
        new HomeBannerResponse(
          homeBanner.id,
          homeBanner.title,
          homeBanner.description,
          homeBanner.image,
        ),
    );
  }

  async findOne(id: string) {
    const homeBanner = await this.homeBannerRepository.findOne({
      where: { id },
      relations: ['perfumes'],
    });
    if (!homeBanner)
      throw new BadRequestException(
        'No existe un home banner con ese identificador',
      );
    return new HomeBannerDetailsResponse(
      homeBanner.id,
      homeBanner.title,
      homeBanner.description,
      homeBanner.image,
      await Promise.all(
        homeBanner.perfumes.map(
          async (perfume) => await this.perfumeService.findOne(perfume.id),
        ),
      ),
    );
  }

  async update(id: string, updateHomeBannerDto: UpdateHomeBannerDto) {
    const homeBanner = await this.homeBannerRepository.findOne({
      where: { id },
    });
    Object.assign(homeBanner, updateHomeBannerDto);

    return await this.homeBannerRepository.save(homeBanner);
  }

  async remove(id: string) {
    return await this.homeBannerRepository.delete({ id });
  }
}
