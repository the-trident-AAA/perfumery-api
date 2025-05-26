import { BadRequestException, Injectable } from '@nestjs/common';
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

  async find() {
    return await this.db.userRepository.find();
  }

  async findOneByUsername(username: string) {
    return await this.db.userRepository.findOneBy({ username });
  }

  async remove(id: string) {
    const user = await this.db.userRepository.findOne({ where: { id } });

    if (!user)
      throw new BadRequestException(
        'No exite un usuario con ese identificador',
      );

    const rowsAffect = await this.db.userRepository.delete({ id });
    // deleted a shop cart
    await this.shopCartService.remove(user.shopCartId);

    return rowsAffect;
  }
}
