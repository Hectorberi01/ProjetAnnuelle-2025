import { Router } from "express";
import { roleControllerInstance } from "../controllers/role.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { createRoleSchema, updateRoleSchema } from "../validators/role.validator";

const router = Router();

router.post("/", validateBody(createRoleSchema), roleControllerInstance.create.bind(roleControllerInstance));
router.get("/", roleControllerInstance.getAll.bind(roleControllerInstance)); 
router.put("/:id", validateBody(updateRoleSchema), roleControllerInstance.update.bind(roleControllerInstance));
router.delete("/:id", roleControllerInstance.delete.bind(roleControllerInstance));

export default router;
