
export interface Promotion {
    id: number;
    name: string;
    startYear: Date;
    endYear: Date;
}

export interface CreatePromotion {
    name: string;
    startYear: Date;
    endYear: Date;
}

export interface User {
    id: number;
    username: string;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    role: Role;
}

export interface CreateUser {
    nom: string;
    prenom: string;
    email: string;
    roleId: number;
}
export interface CreateAdmin {
    nom: string;
    prenom: string;
    email: string;
    password: string;
}

export interface Role {
    id: number;
    name: string;
}