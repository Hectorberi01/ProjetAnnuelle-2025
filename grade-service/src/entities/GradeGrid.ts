import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GradeCriterion } from "./GradeCriterion";

@Entity()
export class GradeGrid {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string; // e.g. "Livrable 1", "Soutenance", etc.

  @Column()
  type!: 'LIVRABLE' | 'RAPPORT' | 'SOUTENANCE';

  @Column()
  projectId!: number;

  @OneToMany(() => GradeCriterion, criterion => criterion.grid, { cascade: true })
  criteria!: GradeCriterion[];

  @Column({ default: false })
  isFinalized!: boolean;
}