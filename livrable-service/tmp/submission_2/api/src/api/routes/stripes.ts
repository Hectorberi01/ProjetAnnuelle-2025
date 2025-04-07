import express from "express";
import { prisma } from "../../utils/prisma";
import Stripe from "stripe";
import { Donations, Subscriptions } from "@prisma/client";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const initStripes = (app: express.Express) => {
  app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    (request, response) => {
      const sig = request.headers["stripe-signature"];

      let event;

      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          sig,
          endpointSecret
        );
      } catch (err: any) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      // Handle the event
      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntentSucceeded = event.data.object;
          console.log("Payment intent succeeded:", paymentIntentSucceeded);

        // Create a donation record for the payment
        case "payment_intent.succeeded": {
          const paymentIntentSucceeded = event.data.object;
          console.log("Payment intent succeeded:", paymentIntentSucceeded);
          break;
        }

        case "invoice.payment_succeeded": {
          const invoice = event.data.object as Stripe.Invoice;
          const subscriptionId = invoice.subscription as string;

          if (!subscriptionId) {
            console.error("Missing subscription ID in invoice");
            response.sendStatus(400);
            return;
            break;
          }
          break;
        }

        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const stripOrganizationId = session.metadata?.organization_id;

          if (!stripOrganizationId) {
            console.error("Missing organization_id in session metadata");
            response.sendStatus(400);
            return;
          }

          const donationData: Omit<
            Donations,
            "id" | "createdAt" | "updatedAt"
          > = {
            amount: session.amount_total ? session.amount_total / 100 : 0, // Convert cents to dollars
            date: new Date(session.created * 1000),
            donorEmail: session.customer_details?.email || "",
            donorName: session.customer_details?.name || "",
            organizationId: parseInt(stripOrganizationId),
            stripePaymentId: session.payment_intent as string,
            recurring: session.mode === "subscription",
          };

          const donateur = async () =>
            await prisma.donations.create({ data: donationData });
          console.log("Donation created:", donationData);
          break;
        }
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      // Return a 200 response to acknowledge receipt of the event
      response.send();
    }
  );
};
