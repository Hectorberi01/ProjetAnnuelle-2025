import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Promotion } from "./Promotion";

@Entity()
export class PromotionStudent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  promotionId!: number;

  @Column()
  studentId!: number;

  @ManyToOne(() => Promotion, (promotion) => promotion.promotionStudents)
  promotion?: Promotion;
}