import { RequestHandler } from "express";
import { UserService } from "../services/user.service";
import e, { Request, Response } from 'express';


const userService = new UserService();

export const create = async (req:Request, res:Response)=> {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/*
export const createAdmin = async (req: Request, res: Response) => {
  console.log("req.body");
  console.log(req.body);
  try {
    const user = await userService.createAdmin(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};*/

export const getAll = async (req: Request, res: Response) => {
  try {
    console.log("getAll users");
    const users = await userService.findAll();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
};

export const getById = async (req: Request, res: Response) => {
  console.log("getById user");
  const id = Number(req.params?.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "ID invalide" });
    return;
  }

  const user = await userService.findById(id);
  if (!user) {
    res.status(404).json({ message: "Utilisateur non trouvé" });
    return;
  }

  res.status(200).json(user);
};

export const getByEmail = async (req: Request, res: Response) => {
  
  const email = req.params?.email;
  if (!email) {
    res.status(400).json({ message: "Email invalide" });
    return;
  }

  try {
    console.log("getByEmail user");
    const user = await userService.findByEmail(email);
    
    console.log("user trouvé :", user);
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    console.error("Erreur lors de la récupération de l'utilisateur par email:", error.message);
    res.status(500).json({ message: "Erreur serveur lors de la récupération de l'utilisateur" });
  }
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params?.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "ID invalide" });
    return;
  }
  const updated = await userService.update(id, req.body);
  if (!updated) {
    res.status(404).json({ message: "Utilisateur non trouvé" });
    return;
  }
  res.status(200).json(updated);
};

export const updateLastLogin = async (req: Request, res: Response) => {
  const id = Number(req.params?.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "ID invalide" });
    return;
  }

  const updated = await userService.updateLastLogin(id);
  if (!updated) {
    res.status(404).json({ message: "Utilisateur non trouvé" });
    return;
  }

  res.json(updated);
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params?.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "ID invalide" });
    return;
  }

  const deleted = await userService.delete(id);
  if (!deleted) {
    res.status(404).json({ message: "Utilisateur non trouvé" });
    return;
  }

  res.status(204).send();
};
