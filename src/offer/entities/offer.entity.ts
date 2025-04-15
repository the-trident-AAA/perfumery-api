import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'offer' })
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  discount: number;

  @Column()
  typeOfOffer: string;
}
