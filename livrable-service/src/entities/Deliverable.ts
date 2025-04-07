import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Submission } from "./Submission";
import { ValidationRule } from "./ValidationRule";

@Entity()
export class Deliverable {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ default: false })
    projectId!: number;

    @Column()
    name!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column({ type: 'timestamp' })
    deadline!: Date;

    @Column({ default: false })
    allowLate!: boolean;

    @Column({ nullable: true })
    latePenaltyPerHour!: number;

    @OneToMany(() => Submission, submission => submission.deliverable)
    submissions!: Submission[];

    @OneToMany(() => ValidationRule, rule => rule.deliverable)
    rules!: ValidationRule[];
}
