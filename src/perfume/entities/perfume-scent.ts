import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'perfume_scent' })
export class ScentEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ default: 'active' })
  public name: string;
}
