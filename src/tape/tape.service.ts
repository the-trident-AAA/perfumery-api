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

    const tape = this.db.tapeRepository.create({
      ...createTapeDto,
      image,
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

  findOne(id: number) {
    return `This action returns a #${id} tape`;
  }

  async update(id: string, updateTapeDto: UpdateTapeDto) {
    const { image, ...restDTO } = updateTapeDto;
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
