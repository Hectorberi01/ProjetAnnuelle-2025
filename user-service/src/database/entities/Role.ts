import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";


@Entity()
export class Role{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: String;

    @OneToMany(() => User, user => user.role)
    user: User[];

    constructor(id: number, name: String, user: User[]) {
        this.id = id;
        this.name = name;
        this.user = user;
    }
}