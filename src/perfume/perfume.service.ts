import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePerfumeDto } from './dto/create-perfume.dto';
import { UpdatePerfumeDto } from './dto/update-perfume.dto';
import { Between, FindOptionsOrder, ILike, In } from 'typeorm';
import { PerfumeResponse } from './responses/perfume.response';
import { PerfumeDetailsResponse } from './responses/perfume-details.response';
import { BrandResponse } from 'src/brand/responses/brand.response';
import { ScentResponse } from 'src/scent/responses/scent.response';
import { PerfumeTypeResponse } from 'src/perfume-type/responses/perfume-type.response';
import { MinioService } from 'src/minio/minio.service';
import { DatabaseService } from 'src/database/database.service';
import { OfferDetailsResponse } from 'src/offer/responses/offer-details.response';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { PaginationMeta, PagintationResponse } from 'src/utils/api-responses';
import { FiltersPerfumeDto } from './dto/filters-perfume.dto';
import { OrderDto } from 'src/utils/dto/order.dto';
import { OrderPerfumeEntity } from 'src/order/entities/order-perfume.entity';
import { ShopCartPerfumeEntity } from 'src/shop-cart-perfume/entities/shop-cart-perfume.entity';
import { PerfumeEntity } from './entities/perfume.entity';

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

    // Upload the images of the perfume
    const images = dto.images
      ? await Promise.all(
          dto.images.map(
            async (image) =>
              await this.minioService.uploadFile(
                undefined,
                image.buffer,
                image.originalname.split('.').pop(),
                image.mimetype,
              ),
          ),
        )
      : [];

    let totalPrice = dto.price;

    if (dto.offerId) {
      // find the offer
      const offer = await this.db.offerRepository.findOne({
        where: {
          id: dto.offerId,
        },
      });

      if (!offer)
        throw new BadRequestException(
          'La oferta indicada para el perfume no existe',
        );

      // calculate the total price
      totalPrice = dto.price - dto.price * offer.discount;
    }

    const perfume = this.db.perfumeRepository.create({
      ...dto,
      scents,
      image,
      images,
      totalPrice,
      sales: 0,
    });

    return await this.db.perfumeRepository.save(perfume);
  }

  async updateAssociatedPerfumesToOffer(offerId: string, newDiscount: number) {
    await this.db.perfumeRepository.update(
      { offerId },
      {
        totalPrice: () => `price - (price * ${newDiscount})`,
      },
    );
  }

  async updateAssociatedPerfumesToDeleteOffer(offerId: string) {
    await this.db.perfumeRepository.update(
      { offerId },
      {
        totalPrice: () => `price`,
      },
    );
  }

  async getBestSellers(limit: number = 10) {
    const perfumesEntities = await this.db.perfumeRepository.find({
      relations: ['brand', 'perfumeType', 'scents', 'offer'],
      take: limit,
      order: { sales: 'DESC' },
    });

    const perfumes = await Promise.all(
      perfumesEntities.map(async (perfume) => {
        const image = perfume.image
          ? await this.minioService.getPresignedUrl(perfume.image)
          : null;

        return new PerfumeResponse(
          perfume.id,
          perfume.name,
          perfume.description,
          image,
          perfume.brand?.name,
          perfume.gender,
          perfume.scents?.map((scent) => scent.name),
          perfume.milliliters,
          perfume.perfumeType?.name,
          perfume.available,
          perfume.price,
          perfume.sales,
          perfume.cant,
          perfume.offer ? perfume.offer.discount : null,
        );
      }),
    );

    return perfumes;
  }

  async findAll(
    paginationDto: PaginationDto,
    filtersPerfumeDto: FiltersPerfumeDto,
    orderDto: OrderDto,
  ): Promise<PagintationResponse<PerfumeResponse>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    const { order, orderBy } = orderDto;

    const sortableFields = ['id', 'name', 'price', 'cant', 'milliliters', 'totalPrice'];

    const direction = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const orderClause: FindOptionsOrder<PerfumeEntity> =
      orderBy && sortableFields.includes(orderBy)
        ? { [orderBy]: direction }
        : { totalPrice: 'ASC' };

    const [perfumes, total] = await this.db.perfumeRepository.findAndCount({
      where: {
        ...(filtersPerfumeDto.id && { id: filtersPerfumeDto.id }),
        ...(filtersPerfumeDto.name && {
          name: ILike(`%${filtersPerfumeDto.name}%`),
        }),
        ...(filtersPerfumeDto.description && {
          description: ILike(`%${filtersPerfumeDto.description}%`),
        }),
        ...(filtersPerfumeDto.gender && { gender: filtersPerfumeDto.gender }),

        ...(filtersPerfumeDto.available !== undefined && {
          available: filtersPerfumeDto.available,
        }),
        // ✅ Rango para price
        ...((filtersPerfumeDto.priceMin !== undefined ||
          filtersPerfumeDto.priceMax !== undefined) && {
          price: Between(
            filtersPerfumeDto.priceMin ?? 0,
            filtersPerfumeDto.priceMax ?? Number.MAX_SAFE_INTEGER,
          ),
        }),

        // ✅ Rango para milliliters
        ...((filtersPerfumeDto.millilitersMin !== undefined ||
          filtersPerfumeDto.millilitersMax !== undefined) && {
          milliliters: Between(
            filtersPerfumeDto.millilitersMin ?? 0,
            filtersPerfumeDto.millilitersMax ?? Number.MAX_SAFE_INTEGER,
          ),
        }),
        ...(filtersPerfumeDto.cant && { cant: filtersPerfumeDto.cant }),
        ...(filtersPerfumeDto.brandId && {
          brand: { id: filtersPerfumeDto.brandId },
        }),
        ...(filtersPerfumeDto.perfumeTypeId && {
          perfumeType: { id: filtersPerfumeDto.perfumeTypeId },
        }),
        ...(filtersPerfumeDto.scentsIds &&
          filtersPerfumeDto.scentsIds.length > 0 && {
            scents: { id: In(filtersPerfumeDto.scentsIds) },
          }),
        ...(filtersPerfumeDto.offerId && {
          offer: { id: filtersPerfumeDto.offerId },
        }),
      },
      relations: ['brand', 'perfumeType', 'scents', 'offer'],
      skip,
      take: limit,
      order: orderClause,
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
          image,
          perfume.brand?.name,
          perfume.gender,
          perfume.scents?.map((scent) => scent.name),
          perfume.milliliters,
          perfume.perfumeType?.name,
          perfume.available,
          perfume.price,
          perfume.sales,
          perfume.cant,
          perfume.totalPrice,
          perfume.offer ? perfume.offer.discount : null,
        );
      }),
    );

    const lastPage = Math.ceil(total / limit);

    return new PagintationResponse(
      data,
      new PaginationMeta(total, page, limit, lastPage),
    );
  }

  async findOne(id: string) {
    const perfume = await this.db.perfumeRepository.findOne({
      where: { id },
      relations: ['brand', 'perfumeType', 'scents', 'offer'],
    });

    if (!perfume) {
      throw new Error(`Perfume con ID ${id} no encontrado`);
    }

    const image = perfume.image
      ? await this.minioService.getPresignedUrl(perfume.image)
      : null;

    const images = await Promise.all(
      perfume.images.map(
        async (image) => await this.minioService.getPresignedUrl(image),
      ),
    );

    return new PerfumeDetailsResponse(
      perfume.id,
      perfume.name,
      perfume.description,
      image,
      images,
      new BrandResponse(perfume.brand.id, perfume.brand.name),
      perfume.gender,
      perfume.scents.map((scent) => new ScentResponse(scent.id, scent.name)),
      perfume.milliliters,
      new PerfumeTypeResponse(perfume.perfumeType.id, perfume.perfumeType.name),
      perfume.available,
      perfume.price,
      perfume.sales,
      perfume.cant,
      perfume.totalPrice,
      perfume.offer
        ? new OfferDetailsResponse(
            perfume.offer.id,
            perfume.offer.discount,
            perfume.offer.offerType,
            perfume.offer.name,
            perfume.offer.description,
            perfume.offer.scope,
            perfume.offer.image
              ? await this.minioService.getPresignedUrl(perfume.offer.image)
              : null,
          )
        : null,
    );
  }

  async update(id: string, dto: UpdatePerfumeDto) {
    const { image, images, ...restDTO } = dto;
    const perfume = await this.db.perfumeRepository.findOne({
      where: { id },
    });

    if (!perfume)
      throw new BadRequestException(
        'No existe un perfume con ese identificador',
      );

    // get the totalPrice
    let totalPrice = dto.price;

    if (dto.offerId) {
      // get the new offer
      const newOffer = await this.db.offerRepository.findOne({
        where: {
          id: dto.offerId,
        },
      });

      if (!newOffer)
        throw new BadRequestException(
          'No existe una oferta con ese identificador',
        );

      totalPrice = dto.price - dto.price * newOffer.discount;
    }

    Object.assign(perfume, {
      ...restDTO,
      scents: restDTO.scentsId.map((scentId) => ({ id: scentId })), // update the scents
      totalPrice,
    });

    // removed defined relations marked as "undefined"
    if (!dto.offerId) {
      perfume.offerId = null;
    }
    if (image) {
      // delete the old image from Minio
      await this.minioService.deleteFile(perfume.image);
      // upload the new image
      const minioImage = await this.minioService.uploadFile(
        undefined,
        image.buffer,
        image.originalname.split('.').pop(),
        image.mimetype,
      );
      perfume.image = minioImage;
    }

    // delete all images for minio
    await Promise.all(
      perfume.images.map(
        async (image) => await this.minioService.deleteFile(image),
      ),
    );

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
      perfume.images = imagesMinio;
    } else perfume.images = [];

    return await this.db.perfumeRepository.save(perfume);
  }

  async remove(id: string) {
    const perfume = await this.findOne(id);

    if (!perfume) throw new BadRequestException('Perfume no encontrado');

    // verificar que el perfume no se encuentre asociado a ninguna orden
    const orderPerfume = await this.db.orderPerfumeRepository.findOne({
      where: {
        perfumeId: perfume.id,
      },
    });

    if (orderPerfume)
      throw new BadRequestException(
        'No es posible eliminar el perfume ya que se encuentra asociado a la orden: ' +
          orderPerfume.id,
      );

    // delete the image from Minio
    await this.minioService.deleteFile(perfume.image);

    // delete the images from Minio
    await Promise.all(
      perfume.images.map(
        async (image) => await this.minioService.deleteFile(image),
      ),
    );

    // delete relationships in the intermediate table perfume_scent
    await this.db.perfumeRepository.query(
      `DELETE FROM perfume_scent WHERE perfume_id = $1`,
      [id],
    );

    return await this.db.perfumeRepository.delete({ id });
  }

  async updateStockAndSales(
    orderPerfumes: OrderPerfumeEntity[],
    action: 'increase' | 'decrease',
  ) {
    await Promise.all(
      orderPerfumes.map(async (orderPerfume) => {
        // find the perfume
        const perfume = await this.db.perfumeRepository.findOne({
          where: { id: orderPerfume.perfumeId },
        });

        await this.db.perfumeRepository.save({
          ...perfume,
          cant:
            action === 'increase'
              ? perfume.cant + orderPerfume.cant
              : perfume.cant - orderPerfume.cant,
          sales:
            action === 'increase'
              ? perfume.sales - orderPerfume.cant
              : perfume.sales + orderPerfume.cant,
        });
      }),
    );
  }

  // method to check perfume stocks

  async checkStocks(id: string, cant: number): Promise<boolean> {
    const perfume = await this.db.perfumeRepository.findOne({ where: { id } });

    if (!perfume) throw new Error('Perfume no encontrado');

    return perfume.cant >= cant;
  }

  async checkPerfumesStocks(
    orderPerfumes: OrderPerfumeEntity[] | ShopCartPerfumeEntity[],
  ): Promise<boolean> {
    let hasAvailability = true;

    for (
      let index = 0;
      index < orderPerfumes.length && hasAvailability;
      index++
    ) {
      const orderPerfume = orderPerfumes[index];
      hasAvailability = await this.checkStocks(
        orderPerfume.perfumeId,
        orderPerfume.cant,
      );
    }

    return hasAvailability;
  }
}
