import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Role } from "./Role";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  nom!: string;

  @Column()
  prenom!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  address?: string;

  @Column()
  password!: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;

  @Column({ type: "timestamp", nullable: true })
  lastLoginAt!: Date | null;

  @Column({ nullable: true })
  imageUrl?: string;

  @ManyToOne(() => Role, (role) => role.user, { eager: true })
  role!: Role;
}
