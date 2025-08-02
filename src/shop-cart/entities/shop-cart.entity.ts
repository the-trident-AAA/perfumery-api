import { ShopCartPerfumeEntity } from 'src/shop-cart-perfume/entities/shop-cart-perfume.entity';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'shop_cart' })
export class ShopCartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToMany(
    () => ShopCartPerfumeEntity,
    (shopCartPerfume) => shopCartPerfume.shopCart,
    { cascade: true, onDelete: 'CASCADE' },
  )
  shopCartPerfumes: ShopCartPerfumeEntity[];
}
