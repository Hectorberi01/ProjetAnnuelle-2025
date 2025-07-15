import { AppDataSource } from "../database/database";
import { User } from "../database/entities/User";
import { Role } from "../database/entities/Role";
import bcrypt from "bcrypt";

interface CreateUserData {
    nom: string;
    prenom: string;
    email: string;
    phoneNumber?: string;
    password?: string;
    address?: string;
    imageUrl?: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    lastLoginAt?: Date;
    roleId: number;
}
export class UserService {
    private userRepo = AppDataSource.getRepository(User);
    private roleRepo = AppDataSource.getRepository(Role);

    // Create
    async create(data: CreateUserData): Promise<User> {
        const role = await this.roleRepo.findOneBy({ id: data.roleId });
        if (!role) throw new Error("Rôle non trouvé");
        const username =
            data.prenom.trim().charAt(0).toLowerCase() +
            data.nom.trim().substring(0, 7).toLowerCase();

        const password = username

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepo.create({
            nom: data.nom,
            prenom: data.prenom,
            email: data.email,
            username: username,
            phoneNumber: data.phoneNumber || "null",
            address: data.address || "null",
            imageUrl: data.imageUrl || "null",
            isActive: data.isActive ?? true,
            createdAt: data.createdAt ?? new Date(),
            lastLoginAt: data.lastLoginAt ?? null,
            role,
            password: hashedPassword,
        });

        return this.userRepo.save(user);
    }

    // créer un utilisateur avec mot de passe
    async createAdmin(data: {nom: string; prenom: string; email: string; password: string;}): Promise<User> {
        const role = await this.roleRepo.findOneBy({ id: 1 });
        if (!role) throw new Error("Rôle non trouvé");
        const username =
            data.prenom.trim().charAt(0).toLowerCase() +
            data.nom.trim().substring(0, 7).toLowerCase();
        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(data.password, 10);
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
        const data = await this.userRepo.find({
            relations: ["role"],
        });
        return data;
    }

    // UserById
    async findById(id: number): Promise<User | null> {
        return this.userRepo.findOne({ where: { id }, relations: ["role"] });
    }

    // UserByEmail
    async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await this.userRepo.findOne({ where: { email }, relations: ["role"] });
            return user ?? null;
        } catch (error) {
            console.error("Error in findByEmail:", error);
            return null;
        }
    }

    // UserUpdate
    async update(id: number, data: Partial<CreateUserData>): Promise<User | null> {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) return null;

        // Hash the password if it is provided
        if (data.password) {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            data.password = hashedPassword;
        }

        Object.assign(user, data);
        return this.userRepo.save(user);
    }

    async updateLastLogin(id: number): Promise<User | null> {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) return null;

        user.lastLoginAt = new Date();
        return this.userRepo.save(user);
    }

    // UserDelete
    async delete(id: number): Promise<boolean> {
        const result = await this.userRepo.delete(id);
        return result.affected !== 0;
    }
}
