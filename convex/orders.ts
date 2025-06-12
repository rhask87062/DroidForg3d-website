import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const calculatePricing = query({
  args: {
    type: v.string(),
    size: v.string(),
    material: v.string(),
    quantity: v.number(),
    isReusedModel: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Base pricing structure
    const basePrices = {
      small: { pla: 8, abs: 10, petg: 12, tpu: 15, wood: 18, metal: 25, resin: 20 },
      medium: { pla: 15, abs: 18, petg: 22, tpu: 28, wood: 32, metal: 45, resin: 35 },
      large: { pla: 25, abs: 30, petg: 35, tpu: 45, wood: 50, metal: 70, resin: 55 },
      xlarge: { pla: 40, abs: 48, petg: 55, tpu: 70, wood: 80, metal: 110, resin: 85 },
    };

    const generationFee = args.isReusedModel ? 0 : 5; // No generation fee for reused models
    const basePrice = basePrices[args.size as keyof typeof basePrices]?.[args.material as keyof typeof basePrices.small] || 15;
    
    // Apply 30% discount for reused models
    const discountMultiplier = args.isReusedModel ? 0.7 : 1;
    const discountedPrice = basePrice * discountMultiplier;
    
    const unitPrice = generationFee + discountedPrice;
    const subtotal = unitPrice * args.quantity;
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    return {
      generationFee,
      basePrice,
      discountedPrice: args.isReusedModel ? discountedPrice : basePrice,
      unitPrice: parseFloat(unitPrice.toFixed(2)),
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      savings: args.isReusedModel ? parseFloat(((basePrice - discountedPrice) * args.quantity + generationFee).toFixed(2)) : 0,
    };
  },
});

export const createOrder = mutation({
  args: {
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
    stripePaymentIntentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Generate order number
    const orderNumber = `DF${Date.now().toString().slice(-8)}`;

    const orderId = await ctx.db.insert("orders", {
      userId,
      orderNumber,
      items: args.items,
      subtotal: args.subtotal,
      tax: args.tax,
      shipping: args.shipping,
      total: args.total,
      status: args.stripePaymentIntentId ? "paid" : "pending",
      shippingAddress: args.shippingAddress,
      timelapseOptIn: args.timelapseOptIn,
      processVisibilityOptIn: false,
      stripePaymentIntentId: args.stripePaymentIntentId,
    });

    // Increment reuse count for reused models
    for (const item of args.items) {
      if (item.isReusedModel && item.modelId) {
        const model = await ctx.db.get(item.modelId);
        if (model) {
          await ctx.db.patch(item.modelId, {
            reuses: model.reuses + item.quantity,
          });
        }
      }
    }

    return orderId;
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
    trackingNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const order = await ctx.db.get(args.orderId);
    if (!order || order.userId !== userId) {
      throw new Error("Order not found or unauthorized");
    }

    const updateData: any = { status: args.status };
    if (args.trackingNumber) {
      updateData.trackingNumber = args.trackingNumber;
    }

    return await ctx.db.patch(args.orderId, updateData);
  },
});

export const getUserOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const order = await ctx.db.get(args.orderId);
    if (!order || order.userId !== userId) {
      throw new Error("Order not found or unauthorized");
    }

    return order;
  },
});
