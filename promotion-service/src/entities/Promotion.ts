import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PromotionStudent } from "./PromotionStudent";

@Entity()
export class Promotion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  startYear!: Date;

  @Column()
  endYear!: Date;

  @Column( { default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
  
  @OneToMany(() => PromotionStudent, (ps) => ps.promotion)
  promotionStudents!: PromotionStudent[];
}