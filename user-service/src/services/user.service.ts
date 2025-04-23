import { AppDataSource } from "../database/database";
import { User } from "../database/entities/User";
import { Role } from "../database/entities/Role";
import bcrypt from "bcrypt";


export class UserService {
    private userRepo = AppDataSource.getRepository(User);
    private roleRepo = AppDataSource.getRepository(Role);

    // Create
    async create(data: {
        nom: string; prenom: string; email: string; roleId: number;
    }): Promise<User> {
        const role = await this.roleRepo.findOneBy({ id: data.roleId });
        if (!role) throw new Error("Rôle non trouvé");
        const username =
            data.prenom.trim().charAt(0).toLowerCase() +
            data.nom.trim().substring(0, 7).toLowerCase();

        const password = username

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepo.create({
            username,
            nom: data.nom,
            prenom: data.prenom,
            email: data.email,
            role,
            password: hashedPassword,
        });

        return this.userRepo.save(user);
    }

    // UserList
    async findAll(): Promise<User[]> {
        return this.userRepo.find({ relations: ["role"] });
    }

    // UserById
    async findById(id: number): Promise<User | null> {
        return this.userRepo.findOne({ where: { id }, relations: ["role"] });
    }

    // UserUpdate
    async update(id: number, data: Partial<User>): Promise<User | null> {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) return null;

        Object.assign(user, data);
        return this.userRepo.save(user);
    }

    // UserDelete
    async delete(id: number): Promise<boolean> {
        const result = await this.userRepo.delete(id);
        return result.affected !== 0;
    }
}
