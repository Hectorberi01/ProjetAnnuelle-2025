import express from "express"
import {prisma} from "../../utils/prisma"
import {taskResourcePatchValidation, taskResourcePostValidation} from "../validators/task-resource-validator";

export const initTaskResource = (app: express.Express) => {

    app.get("/task-resources", async (_req: express.Request, res: express.Response) => {
        try {
            const allTaskResources = await prisma.taskResources.findMany()
            return res.json(allTaskResources)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })

    app.get("/task-resources/:id", async (req: express.Request, res: express.Response) => {
        try {
            const id = Number(req.params.id)
            const taskResource = await prisma.taskResources.findUnique({
                where: {id}
            })
            return res.json(taskResource)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })

    app.post("/task-resources", async (req: express.Request, res: express.Response) => {
        try {
            const validation = taskResourcePostValidation.validate(req.body)
            if (validation.error) {
                return res.status(400).send({error: validation.error})
            }

            const taskResource = await prisma.taskResources.create({
                data: validation.value
            })

            return res.json(taskResource)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })

    app.patch("/task-resources", async (req: express.Request, res: express.Response) => {
        try {
            const validation = taskResourcePatchValidation.validate(req.body)
            if (validation.error) {
                return res.status(400).send({error: validation.error})
            }

            const taskResourceRequest = validation.value
            const taskResource = await prisma.taskResources.update({
                where: {id: taskResourceRequest.id},
                data: taskResourceRequest,
            })

            return res.json(taskResource)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })

    app.delete("/task-resources/:id", async (req: express.Request, res: express.Response) => {
        try {
            const id = Number(req.params.id)
            const taskResource = await prisma.taskResources.delete({
                where: {id}
            })
            return res.json(taskResource)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })
}
