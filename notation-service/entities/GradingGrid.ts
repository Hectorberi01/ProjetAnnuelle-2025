import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsString, IsNumber, IsEnum, IsBoolean, IsOptional, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { GradingCriteria } from './GradingCriteria';

export enum GradingType {
  DELIVERABLE = 'deliverable',
  REPORT = 'report',
  PRESENTATION = 'presentation'
}

class CriteriaScore {
  @IsString()
  criteriaId!: string;

  @IsNumber()
  score!: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

@Entity('grading_grids')
export class GradingGrid {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  @IsString()
  projectId!: string;

  @Column({ type: 'varchar' })
  @IsString()
  groupId!: string;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @IsString()
  studentId?: string;

  @Column({ type: 'enum', enum: GradingType })
  @IsEnum(GradingType)
  type!: GradingType;

  @Column({ type: 'varchar' })
  @IsString()
  referenceId!: string;

  @Column({ type: 'json' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CriteriaScore)
  criteriaScores!: CriteriaScore[];

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  globalComment?: string;

  @Column({ type: 'decimal', nullable: true })
  @IsOptional()
  @IsNumber()
  finalScore?: number;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  isValidated!: boolean;

  @Column({ type: 'varchar' , nullable: true  })
  @IsString()
  gradedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @IsDateString()
  gradedAt?: Date;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @IsString()
  criteriaId?: string;

  @ManyToOne(() => GradingCriteria, criteria => criteria.gradingGrids)
  @JoinColumn({ name: 'criteriaId' })
  criteria?: GradingCriteria;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}