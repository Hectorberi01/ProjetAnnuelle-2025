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

  @Column( {default: () => "CURRENT_TIMESTAMP"})
  createdAt!: Date;

  @OneToMany(() => GroupStudent, (groupStudent) => groupStudent.groupStudent,{ cascade: ["remove"] })
  groupStudent!: GroupStudent[];
}