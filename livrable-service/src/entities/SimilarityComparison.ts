import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SimilarityComparison {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  deliverableId!: number;

  @Column()
  submissionAId!: number;

  @Column()
  submissionBId!: number;

  @Column('float')
  score!: number;
}
