import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tape' })
export class TapeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  isMain: boolean;
  @Column({ name: 'image', nullable: true })
  image: string;
}
