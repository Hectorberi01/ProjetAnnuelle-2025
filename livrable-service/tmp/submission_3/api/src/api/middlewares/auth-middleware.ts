import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: any
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (token === null) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    (req as any).payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
  } catch (error) {
    return res.status(401).json({ error: error });
  }

  next();
};
