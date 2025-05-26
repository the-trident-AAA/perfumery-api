import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { ShopCartService } from 'src/shop-cart/shop-cart.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly db: DatabaseService,
    private readonly shopCartService: ShopCartService,
  ) {}

  async create(dto: CreateUserDto) {
    // created a shop cart
    const shopCart = await this.shopCartService.create({});
    return await this.db.userRepository.save({
      ...dto,
      shopCartId: shopCart.id,
    });
  }

  async findOneByUsername(username: string) {
    return await this.db.userRepository.findOneBy({ username });
  }

  async remove(id: string) {
    return await this.db.userRepository.delete({ id });
  }

  async removeAll () {
    return await this.db.userRepository.clear()
  }
}
