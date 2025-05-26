import { ShopCartPerfumeEntity } from 'src/shop-cart-perfume/entities/shop-cart-perfume.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'shop_cart' })
export class ShopCartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'user_id' })
  userId: string;
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
  @OneToMany(
    () => ShopCartPerfumeEntity,
    (shopCartPerfume) => shopCartPerfume.shopCart,
  )
  shopCartPerfumes: ShopCartPerfumeEntity[];
}
