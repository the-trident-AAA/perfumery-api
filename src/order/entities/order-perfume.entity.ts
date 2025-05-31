import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';
import { PerfumeEntity } from 'src/perfume/entities/perfume.entity';

@Entity({ name: 'order_perfume' })
export class OrderPerfumeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderEntity, (order) => order.orderPerfumes)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @ManyToOne(() => PerfumeEntity, (perfume) => perfume.orderPerfumes)
  @JoinColumn({ name: 'perfume_id' })
  perfume: PerfumeEntity;

  @Column()
  cant: number;
}
