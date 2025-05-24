import { RequestHandler } from "express";
import { UserService } from "../services/user.service";
import e, { Request, Response } from 'express';


const userService = new UserService();

export const  create = async (req:Request, res:Response)=> {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  console.log("req.body");
  console.log(req.body);
  try {
    const user = await userService.createAdmin(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  console.log("getAll users");
  const users = await userService.findAll();
  res.status(200).json(users);
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
  console.log("getByEmail user");
  const email = req.params?.email;
  if (!email) {
    res.status(400).json({ message: "Email invalide" });
    return;
  }

  const user = await userService.findByEmail(email);
  if (!user) {
    res.status(404).json({ message: "Utilisateur non trouvé" });
    return;
  }

  res.status(200).json(user);
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


/*
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

  createAdmin: RequestHandler = async (req, res) => {
    console.log("req.body");
    console.log(req.body);
    try {
      const user = await this.userService.createAdmin(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  getAll: RequestHandler = async (req, res) => {
    console.log("getAll users");
    const users = await this.userService.findAll();
    res.status(200).json(users);
  };

  getById: RequestHandler = async (req, res) => {
    console.log("getById user");
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

  getByEmail: RequestHandler = async (req, res) => {
    console.log("getByEmail user");
    const email = req.params?.email;
    if (!email) {
      res.status(400).json({ message: "Email invalide" });
      return;
    }

    const user = await this.userService.findByEmail(email);
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

export const userControllerInstance = new UserController();*/
