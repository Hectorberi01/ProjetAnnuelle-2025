import express from "express"
import {prisma} from "../../utils/prisma"
import {resourceTypePatchValidation, resourceTypePostValidation} from "../validators/resource-type-validator";

export const initResourceType = (app: express.Express) => {

    app.get("/resource-types", async (_req: express.Request, res: express.Response) => {
        try {
            const allResourceTypes = await prisma.resourceTypes.findMany()
            return res.json(allResourceTypes)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })

    app.get("/resource-types/:id", async (req: express.Request, res: express.Response) => {
        try {
            const id = Number(req.params.id)
            const resourceType = await prisma.resourceTypes.findUnique({
                where: {id}
            })
            return res.json(resourceType)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })

    app.post("/resource-types", async (req: express.Request, res: express.Response) => {
        try {
            const validation = resourceTypePostValidation.validate(req.body)
            if (validation.error) {
                return res.status(400).send({error: validation.error})
            }

            const resourceType = await prisma.resourceTypes.create({
                data: validation.value
            })

            return res.json(resourceType)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })

    app.patch("/resource-types", async (req: express.Request, res: express.Response) => {
        try {
            const validation = resourceTypePatchValidation.validate(req.body)
            if (validation.error) {
                return res.status(400).send({error: validation.error})
            }

            const resourceTypeRequest = validation.value
            const resourceType = await prisma.resourceTypes.update({
                where: {id: resourceTypeRequest.id},
                data: resourceTypeRequest,
            })

            return res.json(resourceType)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })

    app.delete("/resource-types/:id", async (req: express.Request, res: express.Response) => {
        try {
            const id = Number(req.params.id)
            const resourceType = await prisma.resourceTypes.delete({
                where: {id}
            })
            return res.json(resourceType)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })
}
