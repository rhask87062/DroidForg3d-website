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

// 3D Generation Service Integrations
async function generateWithMeshy(prompt: string, apiKey: string, settings: any) {
  const response = await fetch("https://api.meshy.ai/v1/text-to-3d", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mode: "preview",
      prompt: prompt,
      art_style: settings.style,
      negative_prompt: "low quality, blurry, distorted",
    }),
  });

  if (!response.ok) {
    throw new Error(`Meshy API error: ${response.statusText}`);
  }

  return await response.json();
}

async function generateWithTripo(prompt: string, apiKey: string, settings: any) {
  const response = await fetch("https://api.tripo3d.ai/v2/openapi/task", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "text_to_model",
      prompt: prompt,
      model_version: "v2.0-20240919",
      face_limit: settings.complexity === "simple" ? 2000 : 
                  settings.complexity === "medium" ? 5000 : 10000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tripo API error: ${response.statusText}`);
  }

  return await response.json();
}

async function generateWith3DAIStudio(prompt: string, apiKey: string, settings: any) {
  const response = await fetch("https://api.3daistudio.com/v1/generate", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
      style: settings.style,
      quality: settings.complexity,
      format: "obj",
    }),
  });

  if (!response.ok) {
    throw new Error(`3D AI Studio API error: ${response.statusText}`);
  }

  return await response.json();
}

async function generateWithAlpha3D(prompt: string, apiKey: string, settings: any) {
  const response = await fetch("https://api.alpha3d.io/v1/text-to-3d", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
      style: settings.style,
      topology: settings.printability === "optimized" ? "quad" : "tri",
      resolution: settings.complexity,
    }),
  });

  if (!response.ok) {
    throw new Error(`Alpha3D API error: ${response.statusText}`);
  }

  return await response.json();
}

async function generateWithSloyd(prompt: string, apiKey: string, settings: any) {
  const response = await fetch("https://api.sloyd.ai/v1/generate", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
      style: settings.style,
      lod: settings.complexity === "simple" ? 0 : 
           settings.complexity === "medium" ? 1 : 2,
      format: "fbx",
    }),
  });

  if (!response.ok) {
    throw new Error(`Sloyd API error: ${response.statusText}`);
  }

  return await response.json();
}

async function generateWithPonzu(prompt: string, endpoint: string, settings: any) {
  // For self-hosted Ponzu instance
  const response = await fetch(`${endpoint}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
      settings: settings,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ponzu API error: ${response.statusText}`);
  }

  return await response.json();
}

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const generateModel = action({
  args: {
    prompt: v.string(),
    title: v.string(),
    generator: v.string(),
    useUserApiKey: v.optional(v.boolean()),
    conceptImageId: v.optional(v.id("conceptImages")),
    settings: v.object({
      style: v.string(),
      complexity: v.string(),
      size: v.string(),
      material: v.string(),
      printability: v.string(),
      supports: v.boolean(),
      hollowFill: v.number(),
    }),
  },
  handler: async (ctx, args): Promise<Id<"models">> => {
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

    // Create model record
    const modelId: Id<"models"> = await ctx.runMutation(api.models.createModel, {
      title: args.title,
      prompt: args.prompt,
      generator: args.generator,
      status: "generating",
      conceptImageId: args.conceptImageId,
      settings: args.settings,
    });

    // Enhanced prompt with settings
    const enhancedPrompt = `Create a 3D model: ${args.prompt}
    
Style: ${args.settings.style}
Complexity: ${args.settings.complexity}
Target size: ${args.settings.size}
Material consideration: ${args.settings.material}
Printability: ${args.settings.printability}
Supports needed: ${args.settings.supports ? 'Yes' : 'No'}
Hollow fill percentage: ${args.settings.hollowFill}%

Please generate a detailed 3D model description optimized for 3D printing with these specifications.`;

    try {
      let generationResult;
      let apiKey = "";

      // Get API key based on generator
      if (args.useUserApiKey && profile?.profile?.apiKeys) {
        switch (args.generator) {
          case "meshy":
            apiKey = profile.profile.apiKeys.meshy || "";
            break;
          case "tripo":
            apiKey = profile.profile.apiKeys.tripo || "";
            break;
          case "ai3dStudio":
            apiKey = profile.profile.apiKeys.ai3dStudio || "";
            break;
          case "alpha3d":
            apiKey = profile.profile.apiKeys.alpha3d || "";
            break;
          case "sloyd":
            apiKey = profile.profile.apiKeys.sloyd || "";
            break;
          case "stability":
            apiKey = profile.profile.apiKeys.stability || "";
            break;
        }
      }

        // Use OpenAI to enhance the model description first
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        {
          role: "system",
          content: "You are a 3D modeling expert. Generate detailed technical descriptions for 3D models optimized for printing."
        },
        {
          role: "user",
          content: enhancedPrompt
        }
      ],
    });

    const enhancedDescription = completion.choices[0].message.content || args.prompt;

    // Update model with enhanced description and set status to 'awaiting_approval'
    await ctx.runMutation(api.models.updateModelEnhancedDescription, {
      modelId,
      enhancedDescription,
    });

    return modelId;
  },
});rn modelId;
  },
});

export const testApiConnection = action({
  args: {
    service: v.string(),
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      let response;
      
      switch (args.service) {
        case "meshy":
          response = await fetch("https://api.meshy.ai/v1/user", {
            headers: { "Authorization": `Bearer ${args.apiKey}` }
          });
          break;
        case "tripo":
          response = await fetch("https://api.tripo3d.ai/v2/openapi/user/balance", {
            headers: { "Authorization": `Bearer ${args.apiKey}` }
          });
          break;
        case "ai3dStudio":
          response = await fetch("https://api.3daistudio.com/v1/user", {
            headers: { "Authorization": `Bearer ${args.apiKey}` }
          });
          break;
        case "alpha3d":
          response = await fetch("https://api.alpha3d.io/v1/user", {
            headers: { "Authorization": `Bearer ${args.apiKey}` }
          });
          break;
        case "sloyd":
          response = await fetch("https://api.sloyd.ai/v1/user", {
            headers: { "Authorization": `Bearer ${args.apiKey}` }
          });
          break;
        case "stability":
          response = await fetch("https://api.stability.ai/v1/user/account", {
            headers: { "Authorization": `Bearer ${args.apiKey}` }
          });
          break;
        case "openai":
          response = await fetch("https://api.openai.com/v1/models", {
            headers: { "Authorization": `Bearer ${args.apiKey}` }
          });
          break;
        default:
          throw new Error("Unsupported service");
      }

      if (response?.ok) {
        return { status: "success" };
      } else {
        return { status: "failed" };
      }
    } catch (error) {
      return { status: "failed" };
    }
  },
});

export const createModel = mutation({
  args: {
    title: v.string(),
    prompt: v.string(),
    generator: v.string(),
    status: v.string(),
    conceptImageId: v.optional(v.id("conceptImages")),
    settings: v.object({
      style: v.string(),
      complexity: v.string(),
      size: v.string(),
      material: v.string(),
      printability: v.string(),
      supports: v.boolean(),
      hollowFill: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("models", {
      userId,
      title: args.title,
      prompt: args.prompt,
      generator: args.generator,
      status: args.status,
      conceptImageId: args.conceptImageId,
      settings: args.settings,
      isPublic: false,
      isFeatured: false,
      isReusable: false,
      tags: [],
      likes: 0,
      downloads: 0,
      reuses: 0,
    });
  },
});

export const updateModelComplete = mutation({
  args: {
    modelId: v.id("models"),
    enhancedDescription: v.string(),
    generationData: v.object({
      vertices: v.number(),
      faces: v.number(),
      fileSize: v.number(),
      printTime: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.modelId, {
      status: "completed",
      enhancedDescription: args.enhancedDescription,
      generationData: args.generationData,
    });
  },
});

export const updateModelStatus = mutation({
  args: {
    modelId: v.id("models"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.modelId, {
      status: args.status,
    });
  },
});

export const incrementFreeGenerations = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (profile) {
      await ctx.db.patch(profile._id, {
        freeGenerationsUsed: profile.freeGenerationsUsed + 1,
      });
    }
  },
});

export const getUserModels = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("models")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getPublicModels = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("models")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
});

export const getReusableModels = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("models")
      .withIndex("by_reusable", (q) => q.eq("isReusable", true))
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
});

export const getFeaturedModels = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("models")
      .withIndex("by_featured", (q) => q.eq("isFeatured", true))
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
});

export const toggleModelPublic = mutation({
  args: {
    modelId: v.id("models"),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const model = await ctx.db.get(args.modelId);
    if (!model || model.userId !== userId) {
      throw new Error("Model not found or unauthorized");
    }

    return await ctx.db.patch(args.modelId, {
      isPublic: args.isPublic,
    });
  },
});

export const toggleModelReusable = mutation({
  args: {
    modelId: v.id("models"),
    isReusable: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const model = await ctx.db.get(args.modelId);
    if (!model || model.userId !== userId) {
      throw new Error("Model not found or unauthorized");
    }

    return await ctx.db.patch(args.modelId, {
      isReusable: args.isReusable,
    });
  },
});

export const incrementModelReuse = mutation({
  args: {
    modelId: v.id("models"),
  },
  handler: async (ctx, args) => {
    const model = await ctx.db.get(args.modelId);
    if (!model) throw new Error("Model not found");

    return await ctx.db.patch(args.modelId, {
      reuses: model.reuses + 1,
    });
  },
});

export const likeModel = mutation({
  args: {
    modelId: v.id("models"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const model = await ctx.db.get(args.modelId);
    if (!model) throw new Error("Model not found");

    // Check if user already liked this model
    const existingLike = await ctx.db
      .query("modelLikes")
      .withIndex("by_user_and_model", (q) => 
        q.eq("userId", userId).eq("modelId", args.modelId)
      )
      .first();

    if (existingLike) {
      // Unlike
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.modelId, {
        likes: Math.max(0, model.likes - 1),
      });
      return { liked: false };
    } else {
      // Like
      await ctx.db.insert("modelLikes", {
        userId,
        modelId: args.modelId,
      });
      await ctx.db.patch(args.modelId, {
        likes: model.likes + 1,
      });
      return { liked: true };
    }
  },
});


export const updateModelEnhancedDescription = mutation({
  args: {
    modelId: v.id("models"),
    enhancedDescription: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.modelId, {
      enhancedDescription: args.enhancedDescription,
      status: "awaiting_approval",
    });
  },
});




export const executeModelGeneration = action({
  args: {
    modelId: v.id("models"),
    enhancedPrompt: v.string(),
    generator: v.string(),
    useUserApiKey: v.optional(v.boolean()),
    settings: v.object({
      style: v.string(),
      complexity: v.string(),
      size: v.string(),
      material: v.string(),
      printability: v.string(),
      supports: v.boolean(),
      hollowFill: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.runQuery(api.users.getCurrentUser);

    try {
      let generationResult;
      let apiKey = "";

      // Get API key based on generator
      if (args.useUserApiKey && profile?.profile?.apiKeys) {
        switch (args.generator) {
          case "meshy":
            apiKey = profile.profile.apiKeys.meshy || "";
            break;
          case "tripo":
            apiKey = profile.profile.apiKeys.tripo || "";
            break;
          case "ai3dStudio":
            apiKey = profile.profile.apiKeys.ai3dStudio || "";
            break;
          case "alpha3d":
            apiKey = profile.profile.apiKeys.alpha3d || "";
            break;
          case "sloyd":
            apiKey = profile.profile.apiKeys.sloyd || "";
            break;
          case "stability":
            apiKey = profile.profile.apiKeys.stability || "";
            break;
        }
      }

      // Generate with selected service
      if (args.useUserApiKey && apiKey) {
        switch (args.generator) {
          case "meshy":
            generationResult = await generateWithMeshy(args.enhancedPrompt, apiKey, args.settings);
            break;
          case "tripo":
            generationResult = await generateWithTripo(args.enhancedPrompt, apiKey, args.settings);
            break;
          case "ai3dStudio":
            generationResult = await generateWith3DAIStudio(args.enhancedPrompt, apiKey, args.settings);
            break;
          case "alpha3d":
            generationResult = await generateWithAlpha3D(args.enhancedPrompt, apiKey, args.settings);
            break;
          case "sloyd":
            generationResult = await generateWithSloyd(args.enhancedPrompt, apiKey, args.settings);
            break;
          case "ponzu":
            const ponzuEndpoint = process.env.PONZU_ENDPOINT || "http://localhost:8080";
            generationResult = await generateWithPonzu(args.enhancedPrompt, ponzuEndpoint, args.settings);
            break;
          default:
            generationResult = { task_id: `sim_${Date.now()}` };
        }
      }

      // Simulate completion for now (replace with actual polling logic)
      setTimeout(async () => {
        try {
          await ctx.runMutation(api.models.updateModelComplete, {
            modelId: args.modelId,
            enhancedDescription: args.enhancedPrompt,
            generationData: {
              vertices: Math.floor(Math.random() * 10000) + 1000,
              faces: Math.floor(Math.random() * 20000) + 2000,
              fileSize: Math.floor(Math.random() * 50) + 5, // MB
              printTime: Math.floor(Math.random() * 480) + 60, // minutes
            }
          });

          // Increment free generations used if not using user API key
          if (!args.useUserApiKey) {
            await ctx.runMutation(api.models.incrementFreeGenerations);
          }
        } catch (error) {
          await ctx.runMutation(api.models.updateModelStatus, {
            modelId: args.modelId,
            status: "failed",
          });
        }
      }, 5000); // Increased time for more realistic generation

    } catch (error) {
      await ctx.runMutation(api.models.updateModelStatus, {
        modelId: args.modelId,
        status: "failed",
      });
      throw error;
    }
  },
});

