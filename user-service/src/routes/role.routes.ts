import { Router } from "express";
import { roleControllerInstance } from "../controllers/role.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { createRoleSchema, updateRoleSchema } from "../validators/role.validator";

const router = Router();

router.post("/", validateBody(createRoleSchema), roleControllerInstance.create.bind(roleControllerInstance));// pas d'erreur
router.get("/", roleControllerInstance.getAll.bind(roleControllerInstance)); // pas d'erreur
router.put("/:id", validateBody(updateRoleSchema), roleControllerInstance.update.bind(roleControllerInstance)); // erreur
router.delete("/:id", roleControllerInstance.delete.bind(roleControllerInstance));// erreur

export default router;
