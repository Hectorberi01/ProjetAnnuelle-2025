import express from 'express';
import { PrismaClient } from '@prisma/client';
import {
    activityValidation,
    activityPatchValidation,
    ActivityAttendanceValidator
} from '../validators/activity-validator';
import {authMiddleware} from "../middlewares/auth-middleware";

const prisma = new PrismaClient();

export const initActivities = (app: express.Express) => {

    app.get("/activities", async (req, res) => {
        try {
            const allActivities = await prisma.activities.findMany();
            res.json(allActivities);
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/activities/:id", async (req, res) => {
        try {
            const activity = await prisma.activities.findUnique({
                where: { id: Number(req.params.id) }
            });
            if (activity) {
                res.json(activity);
            } else {
                res.status(404).send({ error: "Activity not found" });
            }
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/activities/:id/members", async (req, res) => {
        try {
            const activities = await prisma.activitiesAttendance.findMany({
                where: { activityId: Number(req.params.id) },
                include: {members: true}
            });

            if (activities) {
                res.json(activities);
            } else {
                res.status(404).send({ error: "Activity not found" });
            }
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/activities/organization/:id", async (req, res) => {
        try {
            const activities = await prisma.activities.findMany({
                where: { organizationId: Number(req.params.id) }
            });
            if (activities) {
                res.json(activities);
            } else {
                res.status(404).send({ error: "Activity not found" });
            }
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/getActivityAttendance/:id", authMiddleware, async (req: any, res) => {
        try {
            const validation = ActivityAttendanceValidator.validate(req.body)

            if (validation.error) {
                res.status(400).send({ error: validation.error });
                return;
            }

            const activityId = validation.value.activityId
            const member = req.payload.memberships.find((member: any) => member.organizationId === Number(req.params.id));
            const attendance = await prisma.activitiesAttendance.findUnique({
                where: {
                    activityId_memberId: {
                        activityId: activityId,
                        memberId: member.id
                    }
                }
            });
            res.status(200).json({data: attendance});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    })

    app.post("/activityAttendance/:id", authMiddleware, async (req: any, res) => {
        try {
            const validation = ActivityAttendanceValidator.validate(req.body)

            if (validation.error) {
                res.status(400).send({ error: validation.error });
                return;
            }

            const activityId = validation.value.activityId
            const member = req.payload.memberships.find((member: any) => member.organizationId === Number(req.params.id));
            const insertedAttendance = await prisma.activitiesAttendance.create({
                data: {
                    activityId: activityId,
                    memberId: member.id
                }
            });
            res.status(200).json({data: insertedAttendance});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    })

    app.delete("/activityAttendance/:id", authMiddleware, async (req: any, res) => {
        try {
            const validation = ActivityAttendanceValidator.validate(req.body)

            if (validation.error) {
                res.status(400).send({ error: validation.error });
                return;
            }

            const activityId = validation.value.activityId
            const member = req.payload.memberships.find((member: any) => member.organizationId === Number(req.params.id));
            const deletedAttendance = await prisma.activitiesAttendance.delete({
                where: {
                    activityId_memberId: {
                        activityId: activityId,
                        memberId: member.id
                    }
                }
            });
            res.status(200).json({data: deletedAttendance});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    })

    app.post("/activities", async (req, res) => {
        const validation = activityValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send({ error: validation.error.details });
            return;
        }

        const activityRequest = validation.value;
        try {
            const activity = await prisma.activities.create({
                data: {
                    title: activityRequest.title,
                    description: activityRequest.description,
                    date: activityRequest.date,
                    organizationId: activityRequest.organizationId
                },
            });
            res.json(activity);
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.patch("/activities/:id", async (req, res) => {
        const validation = activityPatchValidation.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error.details });
            return;
        }

        const activityRequest = validation.value;
        try {
            const activity = await prisma.activities.update({
                where: {
                    id: Number(req.params.id),
                },
                data: activityRequest,
            });
            res.json(activity);
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });

    app.delete("/activities/:id", async (req, res) => {
        try {
            const deletedActivity = await prisma.activities.delete({
                where: { id: Number(req.params.id) },
            });
            res.status(200).json(deletedActivity);
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });
};
