import { Injectable } from '@nestjs/common';
import { CreateTapeDto } from './dto/create-tape.dto';
import { UpdateTapeDto } from './dto/update-tape.dto';

@Injectable()
export class TapeService {
  create(createTapeDto: CreateTapeDto) {
    return 'This action adds a new tape';
  }

  findAll() {
    return `This action returns all tape`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tape`;
  }

  update(id: number, updateTapeDto: UpdateTapeDto) {
    return `This action updates a #${id} tape`;
  }

  remove(id: number) {
    return `This action removes a #${id} tape`;
  }
}
