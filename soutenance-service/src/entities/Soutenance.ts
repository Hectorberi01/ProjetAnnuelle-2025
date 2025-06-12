
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Soutenance {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    projectId!: number;
    
    @Column()
    groupId!: number;

    @Column()
    startTime!: Date;

    @Column()
    endTime!: Date;

    @Column()
    order!: number;
}