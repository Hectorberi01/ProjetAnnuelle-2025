import { Router } from "express";
//import { userControllerInstance } from "../controllers/user.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { createUserSchema, updateUserSchema } from "../validators/user.validator";
import { create, deleteUser, getAll, getByEmail, getById, update, updateLastLogin } from "../controllers/user.controller";
//import { createRoleSchema, updateRoleSchema } from "../validators/role.validator";
//import { createRole, deleteRole, getAllRoles, getRoleByName, updateRole } from "../controllers/role.controller";


const router = Router();

//router.post("/", validateBody(createUserSchema),create);
router.post("/",create);
//router.post("/admin", createAdmin);
router.get("/", getAll);
router.get("/:id", getById);
router.get("/email/:email", getByEmail);
//router.put("/:id", validateBody(updateUserSchema), update);
router.put("/:id", update);
router.put("/last-login/:id", updateLastLogin);
router.delete("/:id", deleteUser);

// role routes

// router.post("/roles/", validateBody(createRoleSchema), createRole);
// router.get("/roles/", getAllRoles);
// router.get("/roles/:name", getRoleByName);
// router.put("/roles/:id", validateBody(updateRoleSchema), updateRole);
// router.delete("/roles/:id", deleteRole);

export default router;
