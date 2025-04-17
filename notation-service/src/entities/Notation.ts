
import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany
} from "typeorm";
import { Criterion } from "./Critere";
import "reflect-metadata";
export enum EvaluationType {
  DELIVERABLE = "DELIVERABLE",
  REPORT = "REPORT",
  PRESENTATION = "PRESENTATION"
}

@Entity()
export class Notation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  projectId!: number;
  

  @Column({
    type: "enum",
    enum: EvaluationType
  })
  type!: EvaluationType;

  @Column()
  isIndividual!: boolean;

  @Column("float")
  weight!: number;

  @Column({ default: false })
  isPublished!: boolean;

  @Column({ nullable: true })
  globalComment?: string;

  @OneToMany(() => Criterion, (criterion) => criterion.grid, { cascade: true })
  criteria!: Criterion[];
}
