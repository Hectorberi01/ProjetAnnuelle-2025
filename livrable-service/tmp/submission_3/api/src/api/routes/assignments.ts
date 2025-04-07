import express from "express"
import {prisma} from "../../utils/prisma"
import {assignmentPatchValidation, assignmentPostValidation} from "../validators/assignment-validator";

export const initAssignment = (app: express.Express) => {

    app.get("/assignments", async (_req: express.Request, res: express.Response) => {
        try {
            const allAssignments = await prisma.assignments.findMany()
            return res.json(allAssignments)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })

    app.get("/assignments/:id", async (req: express.Request, res: express.Response) => {
        try {
            const id = Number(req.params.id)
            const assignment = await prisma.assignments.findUnique({
                where: {id}
            })
            return res.json(assignment)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })

    app.post("/assignments", async (req: express.Request, res: express.Response) => {
        try {
            const validation = assignmentPostValidation.validate(req.body)
            if (validation.error) {
                return res.status(400).send({error: validation.error})
            }

            const assignment = await prisma.assignments.create({
                data: validation.value
            })

            return res.json(assignment)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })

    app.patch("/assignments", async (req: express.Request, res: express.Response) => {
        try {
            const validation = assignmentPatchValidation.validate(req.body)
            if (validation.error) {
                return res.status(400).send({error: validation.error})
            }

            const assignmentRequest = validation.value
            const assignment = await prisma.assignments.update({
                where: {id: assignmentRequest.id},
                data: assignmentRequest,
            })

            return res.json(assignment)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })

    app.delete("/assignments/:id", async (req: express.Request, res: express.Response) => {
        try {
            const id = Number(req.params.id)
            const assignment = await prisma.assignments.delete({
                where: {id}
            })
            return res.json(assignment)
        } catch (error) {
            return res.status(500).send({error: error})
        }
    })
}
