import { PerfumeEntity } from 'src/perfume/entities/perfume.entity';
import { ShopCartEntity } from 'src/shop-cart/entities/shop-cart.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'shop_cart_perfume' })
export class ShopCartPerfumeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'perfume_id' })
  perfumeId: string;

  @Column({ name: 'shop_cart_id' })
  shopCartId: string;

  @ManyToOne(() => PerfumeEntity, (perfume) => perfume.shopCartPerfumes)
  @JoinColumn({ name: 'perfume_id' })
  perfume: PerfumeEntity;

  @ManyToOne(() => ShopCartEntity, (shopCart) => shopCart.shopCartPerfumes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shop_cart_id' })
  shopCart: ShopCartEntity;

  @Column()
  cant: number;
}
