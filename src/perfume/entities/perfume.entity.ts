import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gender } from './gender.enum';
import { Brand } from 'src/brand/entities/brand.entity';
import { Scent } from 'src/scent/entities/scent.entity';
import { PerfumeType } from 'src/perfume-type/entities/perfume-type.entity';
import { Offer } from 'src/offer/entities/offer.entity';

@Entity({ name: 'perfume' })
export class Perfume {
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

  @ManyToOne(() => Brand, (brand) => brand.perfumes)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ManyToOne(() => Scent, (scent) => scent.perfumes)
  @JoinColumn({ name: 'scent_id' })
  scent: Scent;

  @ManyToOne(() => PerfumeType, (perfumeType) => perfumeType.perfumes)
  @JoinColumn({ name: 'perfume_type_id' })
  perfumeType: PerfumeType;

  @ManyToOne(() => Offer, (offer) => offer.perfumes)
  @JoinColumn({ name: 'offer_id' })
  offer: Offer;
}
