import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { CritereNotation } from './CritereNotation';

@Entity('grilles_notation')
export class GrilleNotation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'project_id', type: 'uuid' })
  projectId!: string;

  @Column({ length: 255 })
  titre!: string;

  @Column({ length: 50 })
  type!: 'livrable' | 'rapport' | 'soutenance';

  @Column({ name: 'ponderation_globale', type: 'decimal', precision: 3, scale: 2 })
  ponderationGlobale!: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: false })
  validee!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => CritereNotation, critere => critere.grille, { cascade: true })
  criteres!: CritereNotation[];
}