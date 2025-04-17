import { PerfumeEntity } from 'src/perfume/entities/perfume.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'scent' })
export class ScentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => PerfumeEntity, (perfume) => perfume.scent)
  perfumes: PerfumeEntity;
}
