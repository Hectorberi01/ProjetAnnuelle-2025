import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Deliverable } from "./Deliverable";

@Entity()
export class Submission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  groupId!: number;

  @Column({nullable: true})
  fileUrl?: string;
  
  @Column({ type: 'text', nullable: true })
  githubUrl?: string;

  @Column({ type: 'timestamp' })
  submittedAt!: Date;

  @Column()
  isLate!: boolean;

  @Column({ type: 'float', nullable: true })
  similarityRate!: number;

  @ManyToOne(() => Deliverable, deliverable => deliverable.submissions)
  deliverable!: Deliverable;
}
