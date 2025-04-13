import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./Role";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    nom: string;

    @Column()
    prenom: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @ManyToOne(() => Role, role => role.user, { eager: true })
    role: Role;

    constructor(id: number, username: string, nom: string, prenom: string, email: string, password: string, role: Role) {
        this.id = id;
        this.username = username;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}