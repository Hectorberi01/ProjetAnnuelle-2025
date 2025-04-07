import express from "express";
import { prisma } from "../../utils/prisma";
import {
  membershipTypesCreateValidator,
  membershipTypesUpdateValidator,
} from "../validators/membershiptypes-validator";
import Stripe from "stripe";
import { authMiddleware } from "../middlewares/auth-middleware";
import { authzMiddleware } from "../middlewares/authz-middleware";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export const initMembershipTypes = (app: express.Express) => {
  app.get("/membershiptypes", async (req, res) => {
    try {
      const allMembershipTypes = await prisma.membershipTypes.findMany();
      res.json(allMembershipTypes);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/membershiptypes/:id", async (req, res) => {
    try {
      const membershipType = await prisma.membershipTypes.findUnique({
        where: { id: Number(req.params.id) },
      });
      res.json(membershipType);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.post(
    "/membershiptypes",
    authMiddleware,
    authzMiddleware,
    async (req, res) => {
      const validation = membershipTypesCreateValidator.validate(req.body);

      if (validation.error) {
        res.status(400).send({ error: validation.error });
        return;
      }

      const membershipTypesRequest = validation.value;
      try {
        // Créer le produit Stripe
        const stripeProduct = await stripe.products.create({
          name: membershipTypesRequest.name,
          description: membershipTypesRequest.description,
        });

        // Créer le prix Stripe
        const stripePrice = await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: Math.round(membershipTypesRequest.amount * 100),
          currency: "eur",
          recurring: {
            interval: "month",
            interval_count: membershipTypesRequest.duration,
          },
        });

        // Créer le type d'adhésion dans la base de données
        const membershipType = await prisma.membershipTypes.create({
          data: {
            name: membershipTypesRequest.name,
            description: membershipTypesRequest.description,
            amount: membershipTypesRequest.amount,
            duration: membershipTypesRequest.duration,
            organizationId: membershipTypesRequest.organizationId,
            stripeProductId: stripeProduct.id,
          },
        });

        res.json(membershipType);
      } catch (e) {
        res.status(500).send({ error: e });
        return;
      }
    }
  );

  app.put("/membershiptypes/:id", async (req, res) => {
    const validation = membershipTypesUpdateValidator.validate(req.body);

    if (validation.error) {
      res.status(400).send({ error: validation.error });
      return;
    }

    const membershipTypesRequest = validation.value;
    try {
      const membershipType = await prisma.membershipTypes.update({
        where: {
          id: Number(req.params.id),
        },
        data: membershipTypesRequest,
      });
      res.json(membershipType);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.delete("/membershiptypes/:id", async (req, res) => {
    try {
      const deletedMembershipType = await prisma.membershipTypes.delete({
        where: { id: Number(req.params.id) },
      });
      res.status(200).json(deletedMembershipType);
    } catch (e) {
      res.status(500).send({ error: e });
    }
  });

  app.post(
    "/organization/:organizationId/membershiptypes",
    async (req, res) => {
      const validation = membershipTypesCreateValidator.validate(req.body);
      console.log("validation ici", validation);
      if (validation.error) {
        console.log("error validation", validation.error);
        res.status(400).send({ error: validation.error });
        return;
      }

      const membershipTypesRequest = validation.value;
      console.log("membershipTypesRequest", membershipTypesRequest);
      try {
        // Créer le produit Stripe
        const stripeProduct = await stripe.products.create({
          name: membershipTypesRequest.name,
          description: membershipTypesRequest.description,
        });

        // Créer le prix Stripe
        const stripePrice = await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: Math.round(membershipTypesRequest.amount * 100),
          currency: "eur",
          recurring: {
            interval: "month",
            interval_count: membershipTypesRequest.duration,
          },
        });

        // Créer le type d'adhésion dans la base de données
        const membershipType = await prisma.membershipTypes.create({
          data: {
            name: membershipTypesRequest.name,
            description: membershipTypesRequest.description,
            amount: membershipTypesRequest.amount,
            duration: membershipTypesRequest.duration,
            organizationId: membershipTypesRequest.organizationId,
            stripeProductId: stripeProduct.id,
          },
        });

        res.json(membershipType);
      } catch (e) {
        res.status(500).send({ error: e });
        return;
      }
    }
  );

  app.get("/organization/:organizationId/membershiptypes", async (req, res) => {
    try {
      const allMembershipTypes = await prisma.membershipTypes.findMany({
        where: {
          organizationId: Number(req.params.organizationId),
        },
      });
      res.json(allMembershipTypes);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });
};
