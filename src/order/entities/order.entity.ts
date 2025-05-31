import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { State } from './state.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderPerfumeEntity } from './order-perfume.entity';

@Entity({ name: 'order' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: State })
  state: State;

  @Column({ nullable: true })
  price: number;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => OrderPerfumeEntity, (orderPerfume) => orderPerfume.order)
  orderPerfumes: OrderPerfumeEntity[];
}
