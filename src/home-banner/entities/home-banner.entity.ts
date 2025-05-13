import { PerfumeEntity } from 'src/perfume/entities/perfume.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity({ name: 'home_banner' })
export class HomeBannerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column({ nullable: true })
  description?: string;
  @Column({ nullable: true })
  image?: string;
  @ManyToMany(() => PerfumeEntity, (perfume) => perfume.homeBanners)
  @JoinTable()
  perfumes: PerfumeEntity[];
}
