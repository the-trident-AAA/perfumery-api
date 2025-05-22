import { PerfumeEntity } from 'src/perfume/entities/perfume.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'perfume_type' })
export class PerfumeTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  name: string;
  @Column({ nullable: true })
  image?: string;
  @OneToMany(() => PerfumeEntity, (perfume) => perfume.perfumeType)
  perfumes: PerfumeEntity;
}
