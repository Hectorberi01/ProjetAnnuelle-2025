import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne
  } from "typeorm";
  import { Notation } from "./Notation";
  
  @Entity()
  export class Criterion {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    title!: string;
  
    @Column({ nullable: true })
    description?: string;
  
    @Column("float")
    maxPoints!: number;
  
    @Column("float")
    weight!: number;
  
    @ManyToOne(() => Notation, (grid) => grid.criteria)
    grid!: Notation;
  }
  