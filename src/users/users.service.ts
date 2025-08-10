import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { ShopCartService } from 'src/shop-cart/shop-cart.service';
import { UserResponse } from './responses/user.response';
import { MinioService } from 'src/minio/minio.service';
import { UserDetailsResponse } from './responses/user-details.response';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly db: DatabaseService,
    private readonly shopCartService: ShopCartService,
    private readonly minioService: MinioService,
  ) {}

  async create(dto: CreateUserDto) {
    // created a shop cart
    const shopCart = await this.shopCartService.create({});
    return await this.db.userRepository.save({
      ...dto,
      shopCartId: shopCart.id,
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    const userEntity = await this.db.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!userEntity)
      throw new BadGatewayException(
        'No existe un usuario con ese identificador',
      );

    if (dto.username) {
      const userByUsername = await this.db.userRepository.findOne({
        where: {
          username: dto.username,
        },
      });
      if (userByUsername.id !== id)
        throw new BadRequestException(
          'Ya existe en el sistema un usuario con ese nombre de usuario',
        );
      userEntity.username = dto.username;
    }

    if (dto.avatar) {
      // delete the old image from Minio
      if (userEntity.avatar)
        await this.minioService.deleteFile(userEntity.avatar);
      // upload the new image
      const minioImage = await this.minioService.uploadFile(
        undefined,
        dto.avatar.buffer,
        dto.avatar.originalname.split('.').pop(),
        dto.avatar.mimetype,
      );
      userEntity.avatar = minioImage;
    }

    return await this.db.userRepository.save(userEntity);
  }

  async find() {
    const users = await this.db.userRepository.find();

    return await Promise.all(
      users.map(
        async (user) =>
          new UserResponse(
            user.id,
            user.username,
            user.avatar
              ? await this.minioService.getPresignedUrl(user.avatar)
              : null,
            user.email,
            user.role,
          ),
      ),
    );
  }

  async findOne(id: string) {
    const user = await this.db.userRepository.findOne({ where: { id } });

    if (!user)
      throw new BadRequestException(
        'No existe un usuario con ese identificador',
      );

    return new UserDetailsResponse(
      user.id,
      user.username,
      user.avatar,
      user.email,
      user.role,
      await this.shopCartService.findOne(user.shopCartId),
    );
  }

  async findOneWithOutRelations(id: string) {
    const user = await this.db.userRepository.findOne({ where: { id } });

    if (!user)
      throw new BadRequestException(
        'No existe un usuario con ese identificador',
      );

    return new UserResponse(
      user.id,
      user.username,
      user.avatar,
      user.email,
      user.role,
    );
  }

  async findOneByUsername(username: string) {
    return this.db.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'email', 'password', 'role', 'shopCartId'],
    });
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
