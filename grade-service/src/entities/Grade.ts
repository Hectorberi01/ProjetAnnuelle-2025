import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GradeCriterion } from "./GradeCriterion";

@Entity()
export class Grade {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => GradeCriterion)
  criterion!: GradeCriterion;

  @Column()
  groupId!: number;

  @Column('float')
  score!: number;

  @Column({ nullable: true })
  comment?: string;
}