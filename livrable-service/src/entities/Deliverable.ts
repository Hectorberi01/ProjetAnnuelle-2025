import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
//import { Submission } from "./Submission";
//import { ValidationRule } from "./ValidationRule";

@Entity()
export class Deliverable {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ default: false })
    projectId!: number;

    @Column()
    groupId!: number;

    @Column()
    name!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column({ type: 'text', nullable: true })
    githubUrl?: string;

    @Column({nullable: true})
    fileUrl?: string;

    @Column({ default: 0 })
    similarityRate!: number;

    @Column({ type: 'timestamp' })
    submittedAt!: Date;
}
