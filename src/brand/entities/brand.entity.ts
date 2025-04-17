import { PerfumeEntity } from 'src/perfume/entities/perfume.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'brand' })
export class BrandEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => PerfumeEntity, (perfume) => perfume.brand)
  perfumes: PerfumeEntity;
}
