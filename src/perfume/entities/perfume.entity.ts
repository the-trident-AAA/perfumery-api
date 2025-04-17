import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gender } from './gender.enum';
import { BrandEntity } from 'src/brand/entities/brand.entity';
import { ScentEntity } from 'src/scent/entities/scent.entity';
import { PerfumeTypeEntity } from 'src/perfume-type/entities/perfume-type.entity';
import { OfferEntity } from 'src/offer/entities/offer.entity';

@Entity({ name: 'perfume' })
export class PerfumeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column({ name: 'brand_id', nullable: true })
  brandId: number;

  @Column({ enum: Gender })
  gender: Gender;

  @Column({ nullable: true })
  liters: number;

  @Column({ name: 'scent_id' })
  scentId: number;

  @Column({ name: 'perfume_type_id' })
  perfumeTypeId: number;

  @Column()
  available: boolean;

  @Column({ nullable: true })
  price: number;

  @Column({})
  cant: number;

  @Column({ name: 'offer_id', nullable: true })
  offerId: number;

  @ManyToOne(() => BrandEntity, (brand) => brand.perfumes)
  @JoinColumn({ name: 'brand_id' })
  brand: BrandEntity;

  @ManyToOne(() => ScentEntity, (scent) => scent.perfumes)
  @JoinColumn({ name: 'scent_id' })
  scent: ScentEntity;

  @ManyToOne(() => PerfumeTypeEntity, (perfumeType) => perfumeType.perfumes)
  @JoinColumn({ name: 'perfume_type_id' })
  perfumeType: PerfumeTypeEntity;

  @ManyToOne(() => OfferEntity, (offer) => offer.perfumes)
  @JoinColumn({ name: 'offer_id' })
  offer: OfferEntity;
}
