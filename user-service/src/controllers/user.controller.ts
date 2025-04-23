import { RequestHandler } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  create: RequestHandler = async (req, res) => {
    try {
      const user = await this.userService.create(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  getAll: RequestHandler = async (req, res) => {
    const users = await this.userService.findAll();
    res.status(200).json(users);
  };

  getById: RequestHandler = async (req, res) => {
    const id = Number(req.params?.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "ID invalide" });
      return;
    }

    const user = await this.userService.findById(id);
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    res.status(200).json(user);
  };

  update: RequestHandler = async (req, res) => {
    const id = Number(req.params?.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "ID invalide" });
      return;
    }

    const updated = await this.userService.update(id, req.body);
    if (!updated) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
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

    const deleted = await this.userService.delete(id);
    if (!deleted) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    res.status(204).send();
  };
}

export const userControllerInstance = new UserController();
