import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const subscribe = mutation({
  args: {
    email: v.string(),
    categories: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("newsletterSubscriptions")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        categories: args.categories,
        isActive: true,
      });
    }

    return await ctx.db.insert("newsletterSubscriptions", {
      email: args.email,
      categories: args.categories,
      isActive: true,
    });
  },
});

export const unsubscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("newsletterSubscriptions")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (subscription) {
      return await ctx.db.patch(subscription._id, {
        isActive: false,
      });
    }
  },
});
