import express from "express"
import {prisma} from "../../utils/prisma"
import {taskPatchValidation, taskPostValidation} from "../validators/task-validator";

export const initTask = (app: express.Express) => {

    app.get("/tasks", async (_req: express.Request, res: express.Response) => {
        try {
            const allTasks = await prisma.tasks.findMany()
            return res.json(allTasks)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })

    app.get("/tasks/:id", async (req: express.Request, res: express.Response) => {
        try {
            const id = Number(req.params.id)
            const task = await prisma.tasks.findUnique({
                where: {id}
            })
            return res.json(task)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })

    app.post("/tasks", async (req: express.Request, res: express.Response) => {
        try {
            const validation = taskPostValidation.validate(req.body)
            if (validation.error) {
                return res.status(400).send({error: validation.error})
            }

            const task = await prisma.tasks.create({
                data: validation.value
            })

            return res.json(task)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })

    app.patch("/tasks", async (req: express.Request, res: express.Response) => {
        try {
            const validation = taskPatchValidation.validate(req.body)
            if (validation.error) {
                return res.status(400).send({error: validation.error})
            }

            const taskRequest = validation.value
            const task = await prisma.tasks.update({
                where: {id: taskRequest.id},
                data: taskRequest,
            })

            return res.json(task)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })

    app.delete("/tasks/:id", async (req: express.Request, res: express.Response) => {
        try {
            const id = Number(req.params.id)
            const task = await prisma.tasks.delete({
                where: {id}
            })
            return res.json(task)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })
}
