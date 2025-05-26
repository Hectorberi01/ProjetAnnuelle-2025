import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Deliverable } from "./Deliverable";

@Entity()
export class ValidationRule {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  projectId!: number;

  @Column()
  type!: 'maxSize' | 'requiredFile' | 'structure' | 'regex';

  @Column()
  value!: string;
}
