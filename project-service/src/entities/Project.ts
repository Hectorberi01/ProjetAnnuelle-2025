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
  minStudents!: number;  // Minimum number of students required for the project

  @Column({ default: 1 })
  maxStudents!: number; // Maximum number of students allowed for the project

  @Column({ type: 'enum', enum: ['manual', 'random', 'free'] })
  mode!: 'manual' | 'random' | 'free'; // Mode of group formation

  @Column({default: () => "CURRENT_TIMESTAMP"})
  createdAt!: Date;

  @Column({default: () => "CURRENT_TIMESTAMP"})
  updatedAt!: Date;


  @Column({ default: 'draft' })
  status!: 'draft' | 'visible';

  @Column()
  promotionId!: number;
}