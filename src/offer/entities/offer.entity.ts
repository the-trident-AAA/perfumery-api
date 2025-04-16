import { Perfume } from 'src/perfume/entities/perfume.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'offer' })
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  discount: number;

  @Column()
  typeOfOffer: string;

  @OneToMany(() => Perfume, (perfume) => perfume.offer)
  perfumes: Perfume;
}
