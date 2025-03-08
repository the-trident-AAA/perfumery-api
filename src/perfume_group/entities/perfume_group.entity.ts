import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'perfume_group' })
export class PerfumeGroup {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  name: string;
}
