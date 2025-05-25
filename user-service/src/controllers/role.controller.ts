import { RequestHandler } from "express";
import { RoleService } from "../services/role.service";
import e, { Request, Response } from 'express';


export const createRole = async (req: Request, res: Response) => {
  try {
    const role = await new RoleService().create(req.body);
    res.status(201).json(role);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllRoles = async (req: Request, res: Response) => {
  console.log("getAll roles");
  const roles = await new RoleService().findAll();
  res.status(200).json(roles);
};
export const getRoleById = async (req: Request, res: Response) => {
  console.log("getById role");
  const id = Number(req.params?.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "ID invalide" });
    return;
  }
  const role = await new RoleService().findById(id);
  if (!role) {
    res.status(404).json({ message: "Rôle non trouvé" });
    return;
  }
  res.status(200).json(role);
};
export const getRoleByName = async (req: Request, res: Response) => {
  console.log("getByName role");
  const name = req.params?.name;
  if (!name) {
    res.status(400).json({ message: "Nom invalide" });
    return;
  }
  const role = await new RoleService().findByName(name);
  if (!role) {
    res.status(404).json({ message: "Rôle non trouvé" });
    return;
  }
  res.status(200).json(role);
};

export const updateRole = async (req: Request, res: Response) => {
  console.log("update role");
  const id = Number(req.params?.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "ID invalide" });
    return;
  }
  const updated = await new RoleService().update(id, req.body);
  if (!updated) {
    res.status(404).json({ message: "Rôle non trouvé" });
    return;
  }
  res.status(200).json(updated);
};

export const deleteRole = async (req: Request, res: Response) => {
  console.log("delete role");
  const id = Number(req.params?.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "ID invalide" });
    return;
  }
  const deleted = await new RoleService().delete(id);
  if (!deleted) {
    res.status(404).json({ message: "Rôle non trouvé" });
    return;
  }
  res.status(204).send();
};
