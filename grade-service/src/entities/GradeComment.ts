import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GradeGrid } from "./GradeGrid";

@Entity()
export class GradeComment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => GradeGrid)
  grid!: GradeGrid;

  @Column()
  groupId!: number;

  @Column()
  content!: string;
}