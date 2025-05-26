import { ShopCartEntity } from 'src/shop-cart/entities/shop-cart.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'client' })
  role: string;

  @DeleteDateColumn()
  deleteAt: Date;

  @Column({ name: 'shop_cart_id' })
  shopCartId: string;
  @OneToOne(() => ShopCartEntity)
  @JoinColumn({ name: 'shop_cart_id' })
  shopCart: ShopCartEntity;
}
