import { Column, PrimaryGeneratedColumn } from 'typeorm';

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
