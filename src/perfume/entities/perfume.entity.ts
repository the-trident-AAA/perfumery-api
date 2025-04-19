import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
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
  id: string;

  @Column()
  name: string;

  @Column({ name: 'brand_id', nullable: true })
  brandId: string;

  @Column({ enum: Gender })
  gender: Gender;

  @Column({ nullable: true })
  liters: number;

  @Column({ name: 'perfume_type_id' })
  perfumeTypeId: string;

  @Column()
  available: boolean;

  @Column({ nullable: true })
  price: number;

  @Column({})
  cant: number;

  @Column({ name: 'offer_id', nullable: true })
  offerId: string;

  @ManyToOne(() => BrandEntity, (brand) => brand.perfumes)
  @JoinColumn({ name: 'brand_id' })
  brand: BrandEntity;

  @ManyToMany(() => ScentEntity, (scents) => scents.perfumes)
  @JoinTable()
  scents: ScentEntity[];

  @ManyToOne(() => PerfumeTypeEntity, (perfumeType) => perfumeType.perfumes)
  @JoinColumn({ name: 'perfume_type_id' })
  perfumeType: PerfumeTypeEntity;

  @ManyToOne(() => OfferEntity, (offer) => offer.perfumes)
  @JoinColumn({ name: 'offer_id' })
  offer: OfferEntity;
}
