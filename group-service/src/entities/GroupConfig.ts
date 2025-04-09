import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GroupConfig {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  projectId!: number;

  @Column()
  minSize!: number;

  @Column()
  maxSize!: number;

  @Column({ type: 'enum', enum: ['manual', 'random', 'free'] })
  mode!: 'manual' | 'random' | 'free';

  @Column({ nullable: true })
  deadline?: Date;
}