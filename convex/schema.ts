import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  conceptImages: defineTable({
    userId: v.id("users"),
    prompt: v.string(),
    imageUrl: v.string(),
    generator: v.string(),
    status: v.string(),
    isSelected: v.boolean(),
  }).index("by_user", ["userId"]),

  profiles: defineTable({
    userId: v.id("users"),
    freeGenerationsUsed: v.number(),
    subscriptionTier: v.string(),
    apiKeys: v.optional(v.object({
      meshy: v.optional(v.string()),
      tripo: v.optional(v.string()),
      ai3dStudio: v.optional(v.string()),
      neroic: v.optional(v.string()),
      alpha3d: v.optional(v.string()),
      sloyd: v.optional(v.string()),
      ponzu: v.optional(v.string()),
      openai: v.optional(v.string()),
      stability: v.optional(v.string()),
    })),
    communicationPreferences: v.optional(v.object({
      email: v.boolean(),
      sms: v.boolean(),
      aiPhoneCall: v.boolean(),
      phoneNumber: v.optional(v.string()),
    })),
  }).index("by_user", ["userId"]),

  models: defineTable({
    userId: v.id("users"),
    title: v.string(),
    prompt: v.string(),
    enhancedDescription: v.optional(v.string()),
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
    generationData: v.optional(v.object({
      vertices: v.number(),
      faces: v.number(),
      fileSize: v.number(),
      printTime: v.number(),
    })),
    isPublic: v.boolean(),
    isFeatured: v.boolean(),
    isReusable: v.boolean(),
    tags: v.array(v.string()),
    likes: v.number(),
    downloads: v.number(),
    reuses: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_public", ["isPublic"])
    .index("by_featured", ["isFeatured"])
    .index("by_reusable", ["isReusable"]),

  modelLikes: defineTable({
    userId: v.id("users"),
    modelId: v.id("models"),
  }).index("by_user_and_model", ["userId", "modelId"]),

  orders: defineTable({
    userId: v.id("users"),
    orderNumber: v.string(),
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
    status: v.string(),
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
    processVisibilityOptIn: v.boolean(),
    trackingNumber: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
    assignedPrinterId: v.optional(v.id("printers")),
    productionSteps: v.optional(v.array(v.object({
      step: v.string(),
      status: v.string(),
      timestamp: v.number(),
      details: v.optional(v.string()),
    }))),
    communicationPreferences: v.optional(v.object({
      email: v.boolean(),
      sms: v.boolean(),
      aiPhoneCall: v.boolean(),
      phoneNumber: v.optional(v.string()),
    })),
  }).index("by_user", ["userId"]),

  printers: defineTable({
    ownerId: v.id("users"),
    name: v.string(),
    location: v.object({
      country: v.string(),
      state: v.optional(v.string()),
      city: v.string(),
      latitude: v.number(),
      longitude: v.number(),
    }),
    capabilities: v.object({
      materials: v.array(v.string()),
      maxSize: v.object({
        x: v.number(),
        y: v.number(),
        z: v.number(),
      }),
      precision: v.number(),
      supportedFormats: v.array(v.string()),
    }),
    status: v.string(), // active, inactive, maintenance
    commissionRate: v.number(),
    completedOrders: v.number(),
    rating: v.number(),
    isVerified: v.boolean(),
    applicationStatus: v.string(), // pending, approved, rejected
  })
    .index("by_owner", ["ownerId"])
    .index("by_status", ["status"])
    .index("by_location", ["location.country", "location.state"]),

  printerApplications: defineTable({
    userId: v.id("users"),
    personalInfo: v.object({
      firstName: v.string(),
      lastName: v.string(),
      email: v.string(),
      phone: v.string(),
      address: v.object({
        street: v.string(),
        city: v.string(),
        state: v.string(),
        zipCode: v.string(),
        country: v.string(),
      }),
    }),
    printerInfo: v.object({
      brand: v.string(),
      model: v.string(),
      yearPurchased: v.number(),
      materials: v.array(v.string()),
      maxBuildVolume: v.object({
        x: v.number(),
        y: v.number(),
        z: v.number(),
      }),
      hasEnclosure: v.boolean(),
      additionalEquipment: v.array(v.string()),
    }),
    experience: v.object({
      yearsExperience: v.number(),
      previousCommercialWork: v.boolean(),
      specializations: v.array(v.string()),
      portfolioUrls: v.array(v.string()),
    }),
    availability: v.object({
      hoursPerWeek: v.number(),
      preferredSchedule: v.string(),
      vacationPlanning: v.string(),
    }),
    motivation: v.string(),
    status: v.string(), // pending, approved, rejected
    submittedAt: v.number(),
    reviewedAt: v.optional(v.number()),
    reviewNotes: v.optional(v.string()),
  }).index("by_user", ["userId"]).index("by_status", ["status"]),

  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    poBox: v.optional(v.string()),
    referralSource: v.optional(v.string()),
    message: v.string(),
    marketingConsent: v.boolean(),
    status: v.string(),
  }),

  newsletterSubscriptions: defineTable({
    email: v.string(),
    categories: v.array(v.string()),
    isActive: v.boolean(),
  }).index("by_email", ["email"]),

  aiCommunications: defineTable({
    userId: v.id("users"),
    orderId: v.optional(v.id("orders")),
    type: v.string(), // thank_you_call, order_update, follow_up
    status: v.string(), // scheduled, completed, failed
    scheduledFor: v.number(),
    completedAt: v.optional(v.number()),
    phoneNumber: v.string(),
    script: v.string(),
    voiceId: v.string(),
    callDuration: v.optional(v.number()),
    callRecordingUrl: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_scheduled", ["scheduledFor"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
