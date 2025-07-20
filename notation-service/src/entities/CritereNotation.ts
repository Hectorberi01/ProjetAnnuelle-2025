import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GrilleNotation } from './GrilleNotation';

@Entity('criteres_notation')
export class CritereNotation {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ name: 'grille_id', type: 'uuid' })
    grilleId!: string;

  @Column({ length: 255 })
    nom!: string;

  @Column()
    poids!: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'type_evaluation', length: 20, default: 'groupe' })
    typeEvaluation!: 'groupe' | 'individuel';

  @ManyToOne(() => GrilleNotation, grille => grille.criteres, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'grille_id' })
    grille!: GrilleNotation;
}