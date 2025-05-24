import { Router } from "express";
//import { userControllerInstance } from "../controllers/user.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { createUserSchema, updateUserSchema } from "../validators/user.validator";
import { create, createAdmin, deleteUser, getAll, getByEmail, getById, update } from "../controllers/user.controller";

const router = Router();

router.post("/", validateBody(createUserSchema),create);
router.post("/admin", createAdmin);
router.get("/", getAll);
router.get("/:id", getById);
router.get("/email/:email", getByEmail);
router.put("/:id", validateBody(updateUserSchema), update);
router.delete("/:id", deleteUser);

export default router;
