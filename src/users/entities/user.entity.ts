import { ShopCartEntity } from 'src/shop-cart/entities/shop-cart.entity';
import { OrderEntity } from 'src/order/entities/order.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from 'src/common/enums/role.enum';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @DeleteDateColumn()
  deleteAt: Date;

  @Column({ name: 'shop_cart_id' })
  shopCartId: string;

  @OneToOne(() => ShopCartEntity)
  @JoinColumn({ name: 'shop_cart_id' })
  shopCart: ShopCartEntity;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity;
}
