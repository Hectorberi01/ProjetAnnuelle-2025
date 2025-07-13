import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsString, IsNumber, IsEnum, IsBoolean, IsOptional, Min, Max } from 'class-validator';
import { GradingGrid } from './GradingGrid';

export enum CriteriaType {
  GROUP = 'group',
  INDIVIDUAL = 'individual'
}

@Entity('grading_criteria')
export class GradingCriteria {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  @IsString()
  name!: string;

  @Column({ type: 'text' })
  @IsString()
  description!: string;

  @Column({ type: 'decimal' })
  @IsNumber()

  weight!: number;

  @Column({ type: 'decimal' })
  @IsNumber()
  @Min(0)
  maxScore!: number;

  @Column({ type: 'enum', enum: CriteriaType })
  @IsEnum(CriteriaType)
  type!: CriteriaType;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  isCommentRequired!: boolean;

  @Column({ type: 'varchar' })
  @IsString()
  projectId!: string;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @IsString()
  deliverableId?: string;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @IsString()
  reportId?: string;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @IsString()
  presentationId?: string;

  @OneToMany(() => GradingGrid, grid => grid.criteria)
  gradingGrids!: GradingGrid[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}