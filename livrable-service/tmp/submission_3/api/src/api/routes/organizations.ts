import express from "express";
import {prisma} from "../../utils/prisma";
import {authMiddleware} from "../middlewares/auth-middleware";
import {authzMiddleware} from "../middlewares/authz-middleware";
import {organizationPatchValidation, organizationValidation,} from "../validators/organization-validator";
import {v4} from "uuid";

export const initOrganizations = (app: express.Express) => {
  app.get(
    "/organizations",

    async (req, res) => {
      try {
        const allOrganizations = await prisma.organizations.findMany();
        res.json(allOrganizations);
      } catch (e) {
        res.status(500).send({ error: e });
        return;
      }
    }
  );

  app.get("/organizations/:id(\\d+)", async (req, res) => {
    try {
      const organization = await prisma.organizations.findUnique({
        where: { id: Number(req.params.id) },
        include: {
          owner: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          documents: {
            select: {
              id: true,
              title: true,
              description: true,
              path: true,
              createdAt: true,
            },
          },
          ags: {
            select: {
              title: true,
              type: true,
              date: true,
            },
          },
          members: {
            select: {
              role: true,
              isAdmin: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          membershipTypes: {
            select: {
              id: true,
              name: true,
              description: true,
              amount: true,
              duration: true,
            },
          },
        },
      });
      res.json(organization);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  //get all members of an organization
  app.get(
    "/organizations/:organizationId/members",
    authMiddleware,
    async (req, res) => {
      try {
        const members = await prisma.members.findMany({
          where: { organizationId: Number(req.params.organizationId) },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        });
        res.json(members);
      } catch (e) {
        res.status(500).send({ error: e });
      }
    }
  );

  app.get(
    "/organizations/:organizationId/full-members",
    async (req, res) => {
      try {
        const members = await prisma.members.findMany({
          where: { organizationId: Number(req.params.organizationId) },
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true
              },
            },
          },
        });

        res.send(members.map((member: { id: any; user: { firstName: any; lastName: any; }; }) => ({
          id: member.id,
          firstName: member.user.firstName,
          lastName: member.user.lastName
        })))
      } catch (e) {
        res.status(500).send({ error: e });
      }
    }
  );

  app.get("/organizations/createinvite/:id", async (req, res) => {
    try {
      if (!req.params.id) {
        res.status(400).send({ error: "You must specify a id" });
        return;
      }
      const uuid = v4();
      const alreadyExists = await prisma.organizationInvitation.findUnique({
        where: { organizationId: Number(req.params.id) },
      });
      let invitation;
      if (alreadyExists) {
        invitation = await prisma.organizationInvitation.update({
          where: { organizationId: Number(req.params.id) },
          data: {
            uuid: uuid,
          },
        });
      } else {
        invitation = await prisma.organizationInvitation.create({
          data: {
            organizationId: Number(req.params.id),
            uuid: uuid,
          },
        });
      }
      res.json(invitation);
    } catch (e) {
      res.status(500).send({ error: e });
    }
  });

  app.get("/organizations/invite", async (req, res) => {
    try {
      if (!req.query.uuid) {
        res.status(400).send({ error: "You must specify a uuid" });
        return;
      }
      const invitation = await prisma.organizationInvitation.findFirst({
        where: { uuid: String(req.query.uuid) },
        include: {
          organization: true,
        },
      });
      res.json(invitation);
    } catch (e) {
      res.status(500).send({ error: e });
    }
  });

  app.post("/organizations", authMiddleware, async (req, res) => {
    const validation = organizationValidation.validate(req.body);

    if (validation.error) {
      res.status(400).send({ error: validation.error });
      return;
    }

    const organizationRequest = validation.value;
    try {
      const organization = await prisma.organizations.create({
        data: {
          name: organizationRequest.name,
          type: organizationRequest.type,
          address: organizationRequest.address,
          email: organizationRequest.email,
          phone: organizationRequest.phone,
          ownerId: organizationRequest.ownerId,
        },
      });
      res.json(organization);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.patch(
    "/organizations/:id",
    authMiddleware,
    authzMiddleware,
    async (req, res) => {
      const validation = organizationPatchValidation.validate(req.body);

      if (validation.error) {
        console.log("error validation", validation.error);

        res.status(400).send({ error: validation.error });

        return;
      }

      const organizationRequest = validation.value;
      try {
        const organization = await prisma.organizations.update({
          where: {
            id: Number(req.params.id),
          },
          data: organizationRequest,
        });
        res.json(organization);
      } catch (e) {
        console.log("error e", e);
        res.status(500).json({ error: e });
        return;
      }
    }
  );

  app.delete(
    "/organizations/:id",
    authMiddleware,
    authzMiddleware,
    async (req, res) => {
      try {
        const deletedOrganization = await prisma.organizations.delete({
          where: { id: Number(req.params.id) },
        });
        res.status(200).json(deletedOrganization);
      } catch (e) {
        res.status(500).send({ error: e });
      }
    }
  );

  app.post(
    "/organization/:organizationId/join",
    authMiddleware,
    async (req, res) => {}
  );
};
