import { PerfumeEntity } from 'src/perfume/entities/perfume.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'offer' })
export class OfferEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  scope: string;
  @Column()
  discount: number;
  @Column()
  offerType: string;

  @OneToMany(() => PerfumeEntity, (perfume) => perfume.offer)
  perfumes: PerfumeEntity;
}
