import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'scent' })
export class Scent {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  name: string;
}
