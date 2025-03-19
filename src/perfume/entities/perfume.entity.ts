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
import { PerfumeGroup } from 'src/perfume-group/entities/perfume-group.entity';

@Entity({ name: 'perfume' })
export class Perfume {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column({ name: 'brand_id' })
  brandId: number;

  @Column({ enum: Gender })
  gender: Gender;

  @Column({ nullable: true })
  liters: number;

  @Column({ name: 'scent_id' })
  scentId: number;

  @Column({ name: 'perfume_group_id' })
  perfumeGroupId: number;

  @Column()
  available: boolean;

  @Column({ nullable: true })
  price: number;

  @ManyToOne(() => Brand, (brand) => brand.perfumes)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ManyToOne(() => Scent, (scent) => scent.perfumes)
  @JoinColumn({ name: 'scent_id' })
  scent: Scent;

  @ManyToOne(() => PerfumeGroup, (perfumeGroup) => perfumeGroup.perfumes)
  @JoinColumn({ name: 'perfume_group_id' })
  perfumeGroup: PerfumeGroup;
}
