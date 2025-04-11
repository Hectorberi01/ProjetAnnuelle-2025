import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('text')
  description!: string;

  @Column({ default: 'draft' })
  status!: 'draft' | 'visible';

  @Column()
  promotionId!: number;
}