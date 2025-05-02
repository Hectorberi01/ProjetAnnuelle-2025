import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./Group";

@Entity()
export class GroupStudent {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    studentId!: number;
    @Column()
    createdAt!: Date;

    @ManyToOne(() => Group, (group) => group.groupStudent)
    groupStudent!: Group;
}