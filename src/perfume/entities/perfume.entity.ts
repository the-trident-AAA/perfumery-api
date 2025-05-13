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
import { HomeBannerEntity } from 'src/home-banner/entities/home-banner.entity';

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

  @Column({ nullable: true })
  milliliters: number;

  @Column({ name: 'perfume_type_id' })
  perfumeTypeId: string;

  @Column()
  available: boolean;

  @Column({ nullable: true })
  price: number;

  @Column({})
  cant: number;

  @Column({ name: 'offer_id', nullable: true })
  offerId?: string;

  @Column({ name: 'image', nullable: true })
  image: string;

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

  @ManyToOne(() => OfferEntity, (offer) => offer.perfumes)
  @JoinColumn({ name: 'offer_id' })
  offer: OfferEntity;
  @ManyToMany(() => HomeBannerEntity, (homeBanner) => homeBanner.perfumes)
  homeBanners: HomeBannerEntity[];
}
