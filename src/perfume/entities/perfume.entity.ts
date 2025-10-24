import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gender } from './gender.enum';
import { BrandEntity } from 'src/brand/entities/brand.entity';
import { ScentEntity } from 'src/scent/entities/scent.entity';
import { PerfumeTypeEntity } from 'src/perfume-type/entities/perfume-type.entity';
import { OfferEntity } from 'src/offer/entities/offer.entity';
import { HomeBannerEntity } from 'src/home-banner/entities/home-banner.entity';
import { ShopCartPerfumeEntity } from 'src/shop-cart-perfume/entities/shop-cart-perfume.entity';
import { OrderEntity } from 'src/order/entities/order.entity';
import { OrderPerfumeEntity } from 'src/order/entities/order-perfume.entity';

@Entity({ name: 'perfume' })
export class PerfumeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ name: 'brand_id', nullable: true })
  brandId: string;

  @Column({ enum: Gender })
  gender: Gender;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string): number => parseFloat(value),
    },
  })
  milliliters: number;

  @Column({ name: 'perfume_type_id' })
  perfumeTypeId: string;

  @Column()
  available: boolean;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string): number => parseFloat(value),
    },
  })
  price: number;

  @Column({
    name: 'total_price',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string): number => parseFloat(value),
    },
  })
  totalPrice: number;

  @Column({ nullable: true })
  sales: number;

  @Column({})
  cant: number;

  @Column({ name: 'offer_id', nullable: true })
  offerId?: string;

  @Column({ name: 'image', nullable: true })
  image: string;

  @Column({
    name: 'images',
    type: 'json',
    nullable: true,
    default: [],
  })
  images: string[];

  @ManyToOne(() => BrandEntity, (brand) => brand.perfumes)
  @JoinColumn({ name: 'brand_id' })
  brand: BrandEntity;

  @ManyToMany(() => ScentEntity, (scents) => scents.perfumes)
  @JoinTable({
    name: 'perfume_scent',
    joinColumn: {
      name: 'perfume_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'scent_id',
      referencedColumnName: 'id',
    },
  })
  scents: ScentEntity[];

  @ManyToOne(() => PerfumeTypeEntity, (perfumeType) => perfumeType.perfumes)
  @JoinColumn({ name: 'perfume_type_id' })
  perfumeType: PerfumeTypeEntity;

  @ManyToOne(() => OfferEntity, (offer) => offer.perfumes, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'offer_id' })
  offer: OfferEntity;

  @OneToMany(
    () => ShopCartPerfumeEntity,
    (shopCartPerfume) => shopCartPerfume.perfume,
  )
  shopCartPerfumes: ShopCartPerfumeEntity[];

  @OneToMany(() => OrderPerfumeEntity, (orderPerfume) => orderPerfume.perfume)
  orderPerfumes: OrderPerfumeEntity[];
}
