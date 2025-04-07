import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "./Report.entity";

@Entity()
export class ReportSection {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @ManyToOne(() => Report, report => report.sections, { onDelete: 'CASCADE' })
  report!: Report;

  @Column()
  order!: number;
}