import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const scheduleThankYouCall = mutation({
  args: {
    userId: v.id("users"),
    orderId: v.id("orders"),
    phoneNumber: v.string(),
    customerName: v.string(),
    orderTotal: v.number(),
  },
  handler: async (ctx, args) => {
    const script = `Hello ${args.customerName}! This is an automated call from DROIDFORG3D. 

Thank you for your recent order totaling $${args.orderTotal}. Your order has been received and our AI-powered production system is already processing it.

Your 3D model is being prepared by our automated DROID system, and we'll assign it to the nearest printer in our global network for optimal delivery time.

You'll receive real-time updates as your order progresses through each stage of our fully automated production process.

Thank you for choosing DROIDFORG3D - where artificial intelligence meets 3D manufacturing!`;

    return await ctx.db.insert("aiCommunications", {
      userId: args.userId,
      orderId: args.orderId,
      type: "thank_you_call",
      status: "scheduled",
      scheduledFor: Date.now() + 300000, // 5 minutes from now
      phoneNumber: args.phoneNumber,
      script,
      voiceId: "default", // Will be configurable
    });
  },
});

export const processScheduledCalls = action({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const scheduledCalls = await ctx.runQuery(api.aiCommunications.getScheduledCalls, { before: now });

    for (const call of scheduledCalls) {
      try {
        await makeElevenLabsCall(call);
        await ctx.runMutation(api.aiCommunications.markCallCompleted, {
          callId: call._id,
          completedAt: now,
          callDuration: 30, // Placeholder
        });
      } catch (error) {
        await ctx.runMutation(api.aiCommunications.markCallFailed, {
          callId: call._id,
        });
      }
    }
  },
});

async function makeElevenLabsCall(call: any) {
  const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
  if (!elevenLabsApiKey) {
    throw new Error("Eleven Labs API key not configured");
  }

  // Generate speech from text
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${call.voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': elevenLabsApiKey,
    },
    body: JSON.stringify({
      text: call.script,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Eleven Labs API error: ${response.statusText}`);
  }

  // In a real implementation, you would integrate with a phone service
  // to actually make the call using the generated audio
  console.log(`AI call scheduled for ${call.phoneNumber}`);
}

export const getScheduledCalls = query({
  args: { before: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiCommunications")
      .withIndex("by_status", (q) => q.eq("status", "scheduled"))
      .filter((q) => q.lte(q.field("scheduledFor"), args.before))
      .collect();
  },
});

export const markCallCompleted = mutation({
  args: {
    callId: v.id("aiCommunications"),
    completedAt: v.number(),
    callDuration: v.number(),
    callRecordingUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.callId, {
      status: "completed",
      completedAt: args.completedAt,
      callDuration: args.callDuration,
      callRecordingUrl: args.callRecordingUrl,
    });
  },
});

export const markCallFailed = mutation({
  args: {
    callId: v.id("aiCommunications"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.callId, {
      status: "failed",
    });
  },
});

export const getUserCommunications = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("aiCommunications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});
