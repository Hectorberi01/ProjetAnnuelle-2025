import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GradeGrid } from "./GradeGrid";

@Entity()
export class GradeCriterion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  weight!: number;

  @ManyToOne(() => GradeGrid, grid => grid.criteria)
  grid!: GradeGrid;
}