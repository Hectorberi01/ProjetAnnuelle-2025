import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('text')
  description!: string;

  @Column({nullable: true})
  soutenanceDate!: Date;

  @Column({ default: 1 })
  minStudents!: number; 

  @Column({ default: 1 })
  maxStudents!: number; 

  @Column({ type: 'timestamp' })
  deadline!: Date;

  @Column({ default: false })
  allowLate!: boolean;

  @Column({ nullable: true })
  latePenaltyPerHour!: number;

  @Column({ type: 'enum', enum: ['manual', 'random', 'free'] })
  mode!: 'manual' | 'random' | 'free';

  @Column({default: () => "CURRENT_TIMESTAMP"})
  createdAt!: Date;

  @Column({default: () => "CURRENT_TIMESTAMP"})
  updatedAt!: Date;


  @Column({ default: 'draft' })
  status!: 'draft' | 'visible';

  @Column()
  promotionId!: number;
}