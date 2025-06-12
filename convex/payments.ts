import { action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const createPaymentIntent = action({
  args: {
    amount: v.number(), // Amount in cents
    currency: v.optional(v.string()),
    orderData: v.object({
      items: v.array(v.object({
        type: v.string(),
        modelId: v.optional(v.id("models")),
        quantity: v.number(),
        size: v.string(),
        material: v.string(),
        color: v.optional(v.string()),
        price: v.number(),
        isReusedModel: v.optional(v.boolean()),
      })),
      subtotal: v.number(),
      tax: v.number(),
      shipping: v.number(),
      total: v.number(),
      shippingAddress: v.object({
        name: v.string(),
        address1: v.string(),
        address2: v.optional(v.string()),
        city: v.string(),
        state: v.string(),
        zipCode: v.string(),
        country: v.string(),
      }),
      timelapseOptIn: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // You'll need to set your Stripe secret key as an environment variable
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not configured");
    }

    try {
      // Create Stripe payment intent
      const response = await fetch("https://api.stripe.com/v1/payment_intents", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${stripeSecretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          amount: args.amount.toString(),
          currency: args.currency || "usd",
          automatic_payment_methods: JSON.stringify({ enabled: true }),
          metadata: JSON.stringify({
            userId,
            orderData: JSON.stringify(args.orderData),
          }),
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Stripe API error: ${error}`);
      }

      const paymentIntent = await response.json();
      
      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error("Payment intent creation failed:", error);
      throw new Error("Failed to create payment intent");
    }
  },
});

export const confirmPayment: any = action({
  args: {
    paymentIntentId: v.string(),
    orderData: v.object({
      items: v.array(v.object({
        type: v.string(),
        modelId: v.optional(v.id("models")),
        quantity: v.number(),
        size: v.string(),
        material: v.string(),
        color: v.optional(v.string()),
        price: v.number(),
        isReusedModel: v.optional(v.boolean()),
      })),
      subtotal: v.number(),
      tax: v.number(),
      shipping: v.number(),
      total: v.number(),
      shippingAddress: v.object({
        name: v.string(),
        address1: v.string(),
        address2: v.optional(v.string()),
        city: v.string(),
        state: v.string(),
        zipCode: v.string(),
        country: v.string(),
      }),
      timelapseOptIn: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Create the order in our database
    const orderId = await ctx.runMutation(api.orders.createOrder, {
      ...args.orderData,
      stripePaymentIntentId: args.paymentIntentId,
    });

    return { orderId };
  },
});
