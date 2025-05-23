import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateUserDto) {
    return await this.db.userRepository.save(dto);
  }

  async findOneByUsername(username: string) {
    return await this.db.userRepository.findOneBy({ username });
  }
}
