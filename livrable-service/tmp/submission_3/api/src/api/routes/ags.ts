import express from "express";
import { prisma } from "../../utils/prisma";
import {
  agsValidation,
  agsPatchValidation,
  AgAttendanceValidator
} from "../validators/ag-validator";
import { authMiddleware } from "../middlewares/auth-middleware";

export const initAGS = (app: express.Express) => {
  app.get("/ags", async (req, res) => {
    try {
      const allAGS = await prisma.aGs.findMany();
      res.json(allAGS);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/ags/:id", async (req, res) => {
    try {
      const ags = await prisma.aGs.findUnique({
        where: { id: Number(req.params.id) },
      });
      res.json(ags);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/ags/organization/:id", async (req, res) => {
    try {
      const ags = await prisma.aGs.findMany({
        where: { organizationId: Number(req.params.id) },
      });
      res.json(ags);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.post("/agattendance/:id", authMiddleware, async (req: any, res) => {
    try {
      const validation = AgAttendanceValidator.validate(req.body)

      if (validation.error) {
        res.status(400).send({ error: validation.error });
        return;
      }

      const agId = validation.value.agId;
      const member = req.payload.memberships.find((member: any) => member.organizationId === Number(req.params.id));
      const insertedAttendance = await prisma.aGAttendance.create({
        data: {
          agId: agId,
          memberId: member.id
        }
      });
      res.status(200).json({data: insertedAttendance});
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  })

  app.get("/ags/:id/members", async (req, res) => {
    try {
      const members = await prisma.aGAttendance.findMany({
        where: { agId: Number(req.params.id) },
        include: {members: true}
      });

      if (members) {
        res.json(members);
      } else {
        res.status(404).send({ error: "Activity not found" });
      }
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.post("/ags", async (req, res) => {
    const validation = agsValidation.validate(req.body);

    if (validation.error) {
      res.status(400).send({ error: validation.error });
      return;
    }



    const agsRequest = validation.value;
    const memberCount = await prisma.members.count({
      where: { organizationId: agsRequest.organizationId },
    })
    try {
      const ags = await prisma.aGs.create({
        data: {
          title: agsRequest.title,
          description: agsRequest.description,
          date: new Date(agsRequest.date),
          type: agsRequest.type,
          quorum: Math.trunc(memberCount/2),
          organizationId: agsRequest.organizationId,
        },
      });
      res.json(ags);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.patch("/ags/:id", async (req, res) => {
    const validation = agsPatchValidation.validate(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const agsRequest = validation.value;
    try {
      const ags = await prisma.aGs.update({
        where: {
          id: Number(req.params.id),
        },
        data: agsRequest,
      });
      res.json(ags);
    } catch (e) {
      res.status(500).json({ error: e });
      return;
    }
  });

  app.delete("/ags/:id", async (req, res) => {
    try {
      const deletedAGS = await prisma.aGs.delete({
        where: { id: Number(req.params.id) },
      });
      res.status(200).json(deletedAGS);
    } catch (e) {
      res.status(500).send({ error: e });
    }
  });
};
