import { PerfumeEntity } from 'src/perfume/entities/perfume.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'home_banner' })
export class HomeBannerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column({ nullable: true })
  description?: string;
  @Column({
    name: 'images',
    type: 'json',
    nullable: true,
    default: [],
  })
  images: string[];
  @Column({
    name: 'statistical_tips',
    type: 'json',
    nullable: false,
    default: [],
  })
  statisticalTips: {
    statistics: string;
    info: string; // the information about statistics
  }[];
  @Column({
    name: 'info_tips',
    type: 'json',
    nullable: false,
    default: [],
  })
  infoTips: string[];
}
