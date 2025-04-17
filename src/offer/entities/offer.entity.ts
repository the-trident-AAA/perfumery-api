import { PerfumeEntity } from 'src/perfume/entities/perfume.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'offer' })
export class OfferEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  discount: number;

  @Column()
  typeOfOffer: string;

  @OneToMany(() => PerfumeEntity, (perfume) => perfume.offer)
  perfumes: PerfumeEntity;
}
