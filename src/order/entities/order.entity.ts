import {
  BaseEntity,
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
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: State, default: State.PENDING })
  state: State;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => OrderPerfumeEntity, (orderPerfume) => orderPerfume.order, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  orderPerfumes: OrderPerfumeEntity[];
}
