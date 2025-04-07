import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export const createStripeCustomer = async (email: string, name: string) => {
  const customer = await stripe.customers.create({
    email,
    name,
  });
  return customer;
};

export const createProduct = async (organizationId: number, name: string) => {
  const product = await stripe.products.create({
    name,
    metadata: { organization_id: organizationId.toString() },
  });
  return product;
};

export const createPrice = async (
  productId: string,
  membershipTypeId: number,
  amount: number,
  currency: string,
  interval: Stripe.PriceCreateParams.Recurring.Interval
) => {
  const price = await stripe.prices.create({
    unit_amount: amount,
    currency,
    recurring: { interval },
    product: productId,
    metadata: { membership_type_id: membershipTypeId.toString() },
  });
  return price;
};

// ... autres fonctions du service Stripe
