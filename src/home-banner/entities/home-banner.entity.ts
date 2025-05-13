import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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
}
