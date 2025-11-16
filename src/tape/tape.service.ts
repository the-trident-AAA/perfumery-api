import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTapeDto } from './dto/create-tape.dto';
import { UpdateTapeDto } from './dto/update-tape.dto';
import { DatabaseService } from 'src/database/database.service';
import { MinioService } from 'src/minio/minio.service';
import { OrderDto } from 'src/utils/dto/order.dto';
import { FindOptionsOrder } from 'typeorm';
import { TapeEntity } from './entities/tape.entity';
import { TapeResponse } from './responses/tape.response';

@Injectable()
export class TapeService {
  constructor(
    private readonly db: DatabaseService,
    private readonly minioService: MinioService,
  ) {}
  async create(createTapeDto: CreateTapeDto) {
    // Upload the image of the tape
    const image = await this.minioService.uploadFile(
      undefined,
      createTapeDto.image.buffer,
      createTapeDto.image.originalname.split('.').pop(),
      createTapeDto.image.mimetype,
    );
    // Upload the mobile image of the tape
    const mobileImage = await this.minioService.uploadFile(
      undefined,
      createTapeDto.mobileImage.buffer,
      createTapeDto.mobileImage.originalname.split('.').pop(),
      createTapeDto.mobileImage.mimetype,
    );

    const tape = this.db.tapeRepository.create({
      ...createTapeDto,
      image,
      mobileImage,
      isMain: false,
    });

    return await this.db.tapeRepository.save(tape);
  }

  async findAll(orderDto: OrderDto) {
    const { order, orderBy } = orderDto;

    const sortableFields = ['id', 'name', 'isMain'];
    const direction = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const orderClause: FindOptionsOrder<TapeEntity> =
      orderBy && sortableFields.includes(orderBy)
        ? { [orderBy]: direction }
        : { name: 'ASC' };

    const tapes = await this.db.tapeRepository.find({
      order: orderClause,
    });

    return tapes.map(
      (tape) =>
        new TapeResponse(
          tape.id,
          tape.name,
          tape.isMain,
          tape.image ? this.minioService.getPublicUrl(tape.image) : undefined,
        ),
    );
  }

  async findOne(id: string) {
    const tape = await this.db.tapeRepository.findOne({
      where: { id },
    });

    if (!tape)
      throw new BadRequestException('No existe un tape con ese identificador');

    return new TapeResponse(
      tape.id,
      tape.name,
      tape.isMain,
      tape.image ? this.minioService.getPublicUrl(tape.image) : undefined,
    );
  }

  async findMainTape() {
    const tape = await this.db.tapeRepository.findOne({
      where: { isMain: true },
    });

    if (!tape)
      throw new BadRequestException('No existe un tape con ese identificador');

    return new TapeResponse(
      tape.id,
      tape.name,
      tape.isMain,
      tape.image ? this.minioService.getPublicUrl(tape.image) : undefined,
    );
  }

  async update(id: string, updateTapeDto: UpdateTapeDto) {
    const { image, mobileImage, ...restDTO } = updateTapeDto;
    const tape = await this.db.tapeRepository.findOne({
      where: { id },
    });
    Object.assign(tape, restDTO);

    if (image) {
      // delete the old image from Minio
      await this.minioService.deleteFile(tape.image);
      // upload the new image
      const minioImage = await this.minioService.uploadFile(
        undefined,
        image.buffer,
        image.originalname.split('.').pop(),
        image.mimetype,
      );
      tape.image = minioImage;
    }

    if (mobileImage) {
      // delete the old mmobile image from Minio
      await this.minioService.deleteFile(tape.mobileImage);
      // upload the new mobile image
      const minioImage = await this.minioService.uploadFile(
        undefined,
        mobileImage.buffer,
        mobileImage.originalname.split('.').pop(),
        mobileImage.mimetype,
      );
      tape.mobileImage = minioImage;
    }

    return await this.db.tapeRepository.save(tape);
  }

  async markedAsMainTape(id: string) {
    const tape = await this.db.tapeRepository.findOne({
      where: { id },
    });

    if (!tape)
      throw new BadRequestException('No existe un tape con ese identificador');

    if (tape.isMain) tape.isMain = false;
    else {
      // find the last principal tape
      const lastPrincipalTape = await this.db.tapeRepository.findOne({
        where: {
          isMain: true,
        },
      });
      if (lastPrincipalTape && lastPrincipalTape.id !== id) {
        lastPrincipalTape.isMain = false;
        await this.db.tapeRepository.save(lastPrincipalTape);
      }
      tape.isMain = true;
    }

    return await this.db.tapeRepository.save(tape);
  }

  async remove(id: string) {
    const tape = await this.db.tapeRepository.findOne({
      where: { id },
    });

    if (!tape) throw new BadRequestException('No existe un tape con ese id');

    // delete the image from Minio
    await this.minioService.deleteFile(tape.image);

    return await this.db.tapeRepository.delete({ id });
  }
}
