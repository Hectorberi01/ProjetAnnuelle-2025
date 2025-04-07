import express from "express";
import { prisma } from "../../utils/prisma";
import {
  donationsValidation,
  donationsPatchValidation,
} from "../validators/donation-validator";
import { createStripeCustomer } from "../services/stripe-service";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export const initDonations = (app: express.Express) => {
  app.get("/donations", async (req, res) => {
    try {
      const allDonations = await prisma.donations.findMany();
      res.json(allDonations);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/donations/:id", async (req, res) => {
    try {
      const donation = await prisma.donations.findUnique({
        where: { id: Number(req.params.id) },
      });
      res.json(donation);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.post("/donations", async (req, res) => {
    console.log("the path is", req.path);
    console.log("The request is", req.body);
    const validation = donationsValidation.validate(req.body);
    console.log("The validation is", validation);

    if (validation.error) {
      res.status(400).send({ error: validation.error });
      return;
    }
    console.log("The validation is ok");

    const donationsRequest = validation.value;
    console.log("The donations request is", donationsRequest);
    try {
      // Créer un client Stripe pour le donateur
      const customer = await createStripeCustomer(
        donationsRequest.donorEmail,
        donationsRequest.donorName
      );

      let session;
      if (donationsRequest.recurring) {
        const product = await stripe.products.create({
          name: "Recurring Donation",
          metadata: {
            organization_id: donationsRequest.organizationId.toString(),
          },
        });
        const price = await stripe.prices.create({
          unit_amount: donationsRequest.amount,
          currency: "eur",
          recurring: {
            interval: "month",
          },
          product: product.id,
        });

        session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price: price.id,
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: `${process.env.FRONTEND_URL}/donation-success`,
          cancel_url: `${process.env.FRONTEND_URL}/donation-cancel`,
          customer: customer.id,
          metadata: {
            organization_id: donationsRequest.organizationId.toString(),
          },
        });
      } else {
        session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "eur",
                product_data: {
                  name: "One-time Donation",
                },
                unit_amount: donationsRequest.amount,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${process.env.FRONTEND_URL}/donation-success`,
          cancel_url: `${process.env.FRONTEND_URL}/donation-cancel`,
          customer: customer.id,
          metadata: {
            organization_id: donationsRequest.organizationId.toString(),
          },
        });
      }

      res.json({ checkoutUrl: session.url });
    } catch (e) {
      console.error("Error creating donation:", e);
      res.status(500).send({ error: e });
    }
  });

  app.patch("/donations/:id", async (req, res) => {
    const validation = donationsPatchValidation.validate(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const donationsRequest = validation.value;
    try {
      const donation = await prisma.donations.update({
        where: {
          id: Number(req.params.id),
        },
        data: donationsRequest,
      });
      res.json(donation);
    } catch (e) {
      res.status(500).json({ error: e });
      return;
    }
  });

  app.delete("/donations/:id", async (req, res) => {
    try {
      const deletedDonation = await prisma.donations.delete({
        where: { id: Number(req.params.id) },
      });
      res.status(200).json(deletedDonation);
    } catch (e) {
      res.status(500).send({ error: e });
    }
  });
};
