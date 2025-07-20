import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('notes_groupes')
export class NoteGroupe {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'project_id', type: 'uuid' })
  projectId!: string;

  @Column({ name: 'group_id', type: 'uuid' })
  groupId!: string;

  @Column({ name: 'grille_id', type: 'uuid' })
  grilleId!: string;

  @Column({ name: 'critere_id' })
  critereId!: number;

  @Column({ name: 'student_id', type: 'uuid', nullable: true })
  studentId?: string;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  note!: number;

  @Column({ type: 'text', nullable: true })
  commentaire?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}