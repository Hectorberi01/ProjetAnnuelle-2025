import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notations_finalisees')
export class NotationFinalisee {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @Column({ name: 'project_id', type: 'uuid' })
    projectId!: string;

  @Column({ name: 'group_id', type: 'uuid' })
    groupId!: string;

  @Column({ name: 'commentaire_projet', type: 'text', nullable: true })
  commentaireProjet?: string;

  @Column({ name: 'note_finale', type: 'decimal', precision: 4, scale: 2 })
    noteFinale!: number;

  @CreateDateColumn({ name: 'finalisee_at' })
    finaliseeAt!: Date;

 
}