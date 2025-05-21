import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ReportSection } from "./ReportSection.entity";

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  projectId!: number;

  @Column()
  groupId!: number;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  //@OneToMany(() => ReportSection, section => section.report, { cascade: true })
  //sections!: ReportSection[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}