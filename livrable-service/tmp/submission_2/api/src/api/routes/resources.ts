import express from "express"
import {prisma} from "../../utils/prisma"
import {resourcePatchValidation, resourcePostValidation} from "../validators/resource-validator";

export const initResource = (app: express.Express) => {

    app.get("/resources", async (_req: express.Request, res: express.Response) => {
        try {
            const allResource = await prisma.resources.findMany()
            return res.json(allResource)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })

    app.get("/resources/:id", async (req: express.Request, res: express.Response) => {
        try {
            const id = Number(req.params.id)
            const resource = await prisma.resources.findUnique({
                where: {id}
            })
            return res.json(resource)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })

    app.post("/resources", async (req: express.Request, res: express.Response) => {
        try {
            const validation = resourcePostValidation.validate(req.body)
            if (validation.error) {
                return res.status(400).send({error: validation.error})
            }

            const resource = await prisma.resources.create({
                data: validation.value
            })

            return res.json(resource)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })

    app.patch("/resources", async (req: express.Request, res: express.Response) => {
        try {
            const validation = resourcePatchValidation.validate(req.body)
            if (validation.error) {
                return res.status(400).send({error: validation.error})
            }

            const resourceRequest = validation.value
            const resource = await prisma.resources.update({
                where: {id: resourceRequest.id},
                data: resourceRequest,
            })

            return res.json(resource)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })

    app.delete("/resources/:id", async (req: express.Request, res: express.Response) => {
        try {
            const id = Number(req.params.id)
            const resource = await prisma.resources.delete({
                where: {id}
            })
            return res.json(resource)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })
}
