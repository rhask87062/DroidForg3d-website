import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

// 2D Image Generation Service Integrations
async function generateImageWithStability(prompt: string, apiKey: string, settings: any) {
  const response = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text_prompts: [{ text: prompt }],
      cfg_scale: 7,
      height: 1024,
      width: 1024,
      steps: 30,
      samples: 4, // Generate 4 variations
      style_preset: settings.style === "realistic" ? "photographic" : settings.style,
    }),
  });

  if (!response.ok) {
    throw new Error(`Stability AI API error: ${response.statusText}`);
  }

  return await response.json();
}

async function generateImageWithOpenAI(prompt: string, apiKey: string, settings: any) {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: settings.complexity === "detailed" ? "hd" : "standard",
      style: settings.style === "realistic" ? "natural" : "vivid",
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  return await response.json();
}

export const generateConceptImages = action({
  args: {
    prompt: v.string(),
    generator: v.string(),
    useUserApiKey: v.optional(v.boolean()),
    settings: v.object({
      style: v.string(),
      complexity: v.string(),
    }),
  },
  handler: async (ctx, args): Promise<Id<"conceptImages">[]> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get user profile for API keys
    const profile = await ctx.runQuery(api.users.getCurrentUser);
    
    // Check free generations if not using user API key
    if (!args.useUserApiKey) {
      const remaining = await ctx.runQuery(api.users.getFreeGenerationsRemaining);
      if (remaining <= 0) {
        throw new Error("No free generations remaining. Please add your own API key or upgrade your account.");
      }
    }

    // Enhanced prompt for 3D-ready concepts
    const enhancedPrompt = `${args.prompt}, 3D model concept, clean background, single object, ${args.settings.style} style, suitable for 3D modeling`;

    try {
      let generationResult;
      let apiKey = "";

      // Get API key based on generator
      if (args.useUserApiKey && profile?.profile?.apiKeys) {
        switch (args.generator) {
          case "stability":
            apiKey = profile.profile.apiKeys.stability || "";
            break;
          case "openai":
            apiKey = profile.profile.apiKeys.openai || "";
            break;
        }
      }

      // Generate with selected service
      if (args.useUserApiKey && apiKey) {
        switch (args.generator) {
          case "stability":
            generationResult = await generateImageWithStability(enhancedPrompt, apiKey, args.settings);
            break;
          case "openai":
            generationResult = await generateImageWithOpenAI(enhancedPrompt, apiKey, args.settings);
            break;
          default:
            // Fallback to simulation
            generationResult = { 
              artifacts: [
                { base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" },
                { base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" },
                { base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" },
                { base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" }
              ]
            };
        }
      } else {
        // Use built-in OpenAI for free generations
        const completion = await openai.chat.completions.create({
          model: "gpt-4.1-nano",
          messages: [
            {
              role: "system",
              content: "Generate a detailed description for a concept image that would be perfect for 3D modeling."
            },
            {
              role: "user",
              content: enhancedPrompt
            }
          ],
        });

        // Simulate multiple concept images for free users
        generationResult = {
          artifacts: [
            { base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" },
            { base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" },
            { base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" },
            { base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" }
          ]
        };
      }

      // Create concept image records
      const conceptImageIds: Id<"conceptImages">[] = [];
      const images = generationResult.artifacts || generationResult.data || [];

      for (let i = 0; i < Math.min(images.length, 4); i++) {
        const image = images[i];
        const imageUrl = image.base64 || image.url || `https://picsum.photos/1024/1024?random=${Date.now()}-${i}`;
        
        const conceptImageId = await ctx.runMutation(api.conceptImages.createConceptImage, {
          prompt: args.prompt,
          imageUrl,
          generator: args.generator,
          status: "completed",
        });
        
        conceptImageIds.push(conceptImageId);
      }

      // Increment free generations used if not using user API key
      if (!args.useUserApiKey) {
        await ctx.runMutation(api.models.incrementFreeGenerations);
      }

      return conceptImageIds;

    } catch (error) {
      throw error;
    }
  },
});

export const createConceptImage = mutation({
  args: {
    prompt: v.string(),
    imageUrl: v.string(),
    generator: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("conceptImages", {
      userId,
      prompt: args.prompt,
      imageUrl: args.imageUrl,
      generator: args.generator,
      status: args.status,
      isSelected: false,
    });
  },
});

export const uploadConceptImage = mutation({
  args: {
    prompt: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("conceptImages", {
      userId,
      prompt: args.prompt,
      imageUrl: args.imageUrl,
      generator: "upload",
      status: "completed",
      isSelected: false,
    });
  },
});

export const selectConceptImage = mutation({
  args: {
    conceptImageId: v.id("conceptImages"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Unselect all other concept images for this user
    const userConceptImages = await ctx.db
      .query("conceptImages")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const image of userConceptImages) {
      await ctx.db.patch(image._id, { isSelected: false });
    }

    // Select the chosen image
    return await ctx.db.patch(args.conceptImageId, { isSelected: true });
  },
});

export const getUserConceptImages = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("conceptImages")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getSelectedConceptImage = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("conceptImages")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isSelected"), true))
      .first();
  },
});

export const deleteConceptImage = mutation({
  args: {
    conceptImageId: v.id("conceptImages"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const conceptImage = await ctx.db.get(args.conceptImageId);
    if (!conceptImage || conceptImage.userId !== userId) {
      throw new Error("Concept image not found or unauthorized");
    }

    return await ctx.db.delete(args.conceptImageId);
  },
});
