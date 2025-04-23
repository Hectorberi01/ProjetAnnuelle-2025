import { RequestHandler } from "express";
import { RoleService } from "../services/role.service";
import { console } from "inspector";

export class RoleController {
  private roleService: RoleService;

  constructor() {
    this.roleService = new RoleService();
  }

  create: RequestHandler = async (req, res) => {
    try {
      const role = await this.roleService.create(req.body);
      res.status(201).json(role);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };


  getAll: RequestHandler = async (req, res) => {
    console.log("getAll called");
  
    const roles = await this.roleService.findAll();
    res.json(roles);
  };

  update: RequestHandler = async (req, res) => {
    const id = Number(req.params?.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "ID invalide" });
      return;
    }

    const updated = await this.roleService.update(id, req.body);
    if (!updated) {
      res.status(404).json({ message: "Rôle non trouvé" });
      return;
    }

    res.json(updated);
  };

  delete: RequestHandler = async (req, res) => {
    const id = Number(req.params?.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "ID invalide" });
      return;
    }

    const deleted = await this.roleService.delete(id);
    if (!deleted) {
      res.status(404).json({ message: "Rôle non trouvé" });
      return;
    }

    res.status(204).send();
  };
}

export const roleControllerInstance = new RoleController();
