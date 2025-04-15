import { Perfume } from 'src/perfume/entities/perfume.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'perfume_type' })
export class PerfumeType {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Perfume, (perfume) => perfume.perfumeType)
  perfumes: Perfume;
}
