import { Perfume } from 'src/perfume/entities/perfume.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'brand' })
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Perfume, (perfume) => perfume.brand)
  perfumes: Perfume;
}
