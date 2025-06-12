import { Router } from "express";
import { createRoleSchema, updateRoleSchema } from "../validators/role.validator";
import { createRole, deleteRole, getAllRoles, getRoleByName, updateRole } from "../controllers/role.controller";
import { validateBody } from "../middlewares/validate.middleware";
const router = Router();

router.post("/", validateBody(createRoleSchema), createRole);
router.get("/", getAllRoles);
router.get("/:name", getRoleByName);
router.put("/:id", validateBody(updateRoleSchema), updateRole);
router.delete("/:id", deleteRole);

export default router;