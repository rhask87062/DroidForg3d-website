import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submitContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    poBox: v.optional(v.string()),
    referralSource: v.optional(v.string()),
    message: v.string(),
    marketingConsent: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contactSubmissions", {
      ...args,
      status: "new",
  
    });
  },
});
