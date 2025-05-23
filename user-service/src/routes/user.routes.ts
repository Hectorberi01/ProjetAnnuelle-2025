import { Router } from "express";
import { userControllerInstance } from "../controllers/user.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { createUserSchema, updateUserSchema } from "../validators/user.validator";

const router = Router();

router.post("/", validateBody(createUserSchema), userControllerInstance.create.bind(userControllerInstance));
router.post("/admin", userControllerInstance.createAdmin.bind(userControllerInstance));
router.get("/", userControllerInstance.getAll.bind(userControllerInstance));
router.get("/:id", userControllerInstance.getById.bind(userControllerInstance));
router.get("/email/:email", userControllerInstance.getByEmail.bind(userControllerInstance));
router.put("/:id", validateBody(updateUserSchema), userControllerInstance.update.bind(userControllerInstance));
router.delete("/:id", userControllerInstance.delete.bind(userControllerInstance));

export default router;
