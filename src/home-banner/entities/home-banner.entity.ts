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
  @Column({ name: 'button_text', nullable: true })
  buttonText?: string;
  @Column()
  isMain: boolean;
  @Column({
    name: 'creation_date',
    nullable: true
  })
  creationDate: Date;
  @Column({ name: 'image', nullable: true })
  image: string;
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
  @Column({
    name: 'filters',
    type: 'json',
    nullable: false,
    default: [],
  })
  filters: {
    name: string;
    value: string;
  }[];
}
