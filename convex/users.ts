import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    
    const user = await ctx.db.get(userId);
    if (!user) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return {
      ...user,
      profile,
    };
  },
});

export const createProfile = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
    poBox: v.optional(v.string()),
    referralSource: v.optional(v.string()),
    marketingConsent: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      return await ctx.db.patch(existingProfile._id, {
        freeGenerationsUsed: existingProfile.freeGenerationsUsed,
        subscriptionTier: existingProfile.subscriptionTier,
      });
    }

    return await ctx.db.insert("profiles", {
      userId,
      freeGenerationsUsed: 0,
      subscriptionTier: "free",
    });
  },
});

export const updateApiKeys = mutation({
  args: {
    apiKeys: v.object({
      meshy: v.optional(v.string()),
      tripo: v.optional(v.string()),
      ai3dStudio: v.optional(v.string()),
      neroic: v.optional(v.string()),
      alpha3d: v.optional(v.string()),
      sloyd: v.optional(v.string()),
      ponzu: v.optional(v.string()),
      openai: v.optional(v.string()),
      stability: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    let profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      // Create profile if it doesn't exist
      const profileId = await ctx.db.insert("profiles", {
        userId,
        freeGenerationsUsed: 0,
        subscriptionTier: "free",
        apiKeys: args.apiKeys,
      });
      return await ctx.db.get(profileId);
    }

    return await ctx.db.patch(profile._id, {
      apiKeys: args.apiKeys,
    });
  },
});

export const getFreeGenerationsRemaining = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return 0;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) return 5; // Default for new users

    return Math.max(0, 5 - profile.freeGenerationsUsed);
  },
});
