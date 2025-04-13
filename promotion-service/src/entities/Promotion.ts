// src/entities/Promotion.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import 'reflect-metadata';
// Your existing imports
@Entity()
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nom!: string;

  @Column({ type: 'varchar' })
  annee!: string;

  @CreateDateColumn()
  created_at!: Date;
}



