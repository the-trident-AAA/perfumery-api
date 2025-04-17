import { PerfumeEntity } from 'src/perfume/entities/perfume.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'scent' })
export class ScentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => PerfumeEntity, (perfume) => perfume.scents)
  perfumes: PerfumeEntity[];
}
