import { Router } from "express";
import { userControllerInstance } from "../controllers/user.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { createUserSchema, updateUserSchema } from "../validators/user.validator";

const router = Router();

router.post("/", validateBody(createUserSchema), userControllerInstance.create.bind(userControllerInstance)); // pas d'erreur
router.get("/", userControllerInstance.getAll.bind(userControllerInstance)); // pas d'erreur
router.get("/:id", userControllerInstance.getById.bind(userControllerInstance)); // erreur
router.put("/:id", validateBody(updateUserSchema), userControllerInstance.update.bind(userControllerInstance)); // erreur
router.delete("/:id", userControllerInstance.delete.bind(userControllerInstance)); // erreur

export default router;
