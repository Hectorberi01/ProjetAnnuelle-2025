import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  projectId!: number;

  @Column({ type: 'json' })
  studentIds!: number[];

  @CreateDateColumn()
  createdAt!: Date;
}