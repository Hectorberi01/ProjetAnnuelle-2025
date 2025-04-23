import { Express } from "express";
import userRoutes from "./user.routes";
import roleRoutes from "./role.routes";

export const initRoutes = (app: Express): void => {
  app.use("/users", userRoutes);
  app.use("/roles", roleRoutes);

  console.log("Routes /users et /roles initialisées.");
};
