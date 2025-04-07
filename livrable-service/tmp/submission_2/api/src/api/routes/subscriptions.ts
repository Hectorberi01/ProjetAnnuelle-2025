import express from "express";
import { prisma } from "../../utils/prisma";
import {
  PaymentStatus,
  subscriptionCreateValidator,
  subscriptionRequest,
  subscriptionUpdateValidator,
} from "../validators/subscription-validator";
import Stripe from "stripe";
import { createStripeCustomer } from "../services/stripe-service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export const initSubscriptions = (app: express.Express) => {
  app.get("/subscriptions", async (req, res) => {
    try {
      const allSubscriptions = await prisma.subscriptions.findMany();
      res.json(allSubscriptions);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/subscriptions/:id", async (req, res) => {
    try {
      const subscription = await prisma.subscriptions.findUnique({
        where: { id: Number(req.params.id) },
      });
      res.json(subscription);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.post("/subscriptions", async (req, res) => {
    const validation = subscriptionCreateValidator.validate(req.body);

    if (validation.error) {
      console.error("Error validating subscription:", validation.error);
      res.status(400).send({ error: validation.error });
      return;
    }

    const subscriptionReq = validation.value;
    try {
      const membershipType = await prisma.membershipTypes.findUnique({
        where: { id: subscriptionReq.membershipTypeId },
      });

      if (!membershipType) {
        res.status(404).send({ error: "Membership type not found" });
        return;
      }

      const member = await prisma.members.findFirst({
        where: {
          organizationId: subscriptionReq.organizationId,
          id: req.body.memberId,
        },
        include: { user: true },
      });

      if (!member) {
        res.status(404).send({ error: "Member not found" });
        return;
      }

      const customer = await createStripeCustomer(
        member.user.email,
        member.user.firstName + " " + member.user.lastName
      );

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: membershipType.name,
              },
              unit_amount: membershipType.amount * 100,
              recurring: {
                interval: "month",
                interval_count: membershipType.duration,
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.FRONTEND_URL}/subscription-success`,
        cancel_url: `${process.env.FRONTEND_URL}/subscription-cancel`,
        customer: customer.id,
        metadata: {
          membership_type_id: membershipType.id.toString(),
          member_id: member.id.toString(),
          organization_id: subscriptionReq.organizationId,
        },
      });

      res.json({ checkoutUrl: session.url });
    } catch (e) {
      console.log("la requete est", req.body);
      console.error("Error creating subscription:", e);
      res.status(500).send({ error: e });
    }
  });

  app.patch("/subscriptions/:id", async (req, res) => {
    const validation = subscriptionUpdateValidator.validate(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const subscriptionRequest = validation.value;
    try {
      const subscription = await prisma.subscriptions.update({
        where: {
          id: Number(req.params.id),
        },
        data: subscriptionRequest,
      });
      res.json(subscription);
    } catch (e) {
      res.status(500).json({ error: e });
      return;
    }
  });

  app.delete("/subscriptions/:id", async (req, res) => {
    try {
      const deletedSubscription = await prisma.subscriptions.delete({
        where: { id: Number(req.params.id) },
      });
      res.status(200).json(deletedSubscription);
    } catch (e) {
      res.status(500).send({ error: e });
    }
  });
};
