import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('commentaires_globaux')
export class CommentaireGlobal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'project_id', type: 'uuid' })
  projectId!: string;

  @Column({ name: 'group_id', type: 'uuid' })
  groupId!: string;

  @Column({ name: 'grille_id', type: 'uuid' })
  grilleId!: string;

  @Column({ type: 'text' })
  commentaire!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}