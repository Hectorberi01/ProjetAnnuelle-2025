import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DeliverableGrade {
  @IsString()
  deliverableId: string | undefined;

  @IsNumber()
  score!: number;

  @IsNumber()
  weight!: number;
}

class ReportGrade {
  @IsString()
  reportId!: string;

  @IsNumber()
  score!: number;

  @IsNumber()
  weight!: number;
}

class PresentationGrade {
  @IsString()
  presentationId!: string;

  @IsNumber()
  score!: number;

  @IsNumber()
  weight!: number;
}

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  @IsString()
  projectId!: string;

  @Column({ type: 'varchar' })
  @IsString()
  studentId!: string;

  @Column({ type: 'varchar' })
  @IsString()
  groupId!: string;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeliverableGrade)
  deliverableGrades?: DeliverableGrade[];

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReportGrade)
  reportGrades?: ReportGrade[];

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => PresentationGrade)
  presentationGrade?: PresentationGrade;

  @Column({ type: 'decimal', nullable: true })
  @IsOptional()
  @IsNumber()
  finalScore?: number;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  isPublished!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}