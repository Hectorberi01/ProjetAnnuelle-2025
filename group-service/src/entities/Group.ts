import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GroupStudent } from "./groupeStudent";

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  projectId!: number;

  @Column()
  name!: string;

  @Column()
  createdAt!: Date;

  @OneToMany(() => GroupStudent, (groupStudent) => groupStudent.groupStudent)
  groupStudent!: GroupStudent[];
}