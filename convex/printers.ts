import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const submitPrinterApplication = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user already has a pending or approved application
    const existingApplication = await ctx.db
      .query("printerApplications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingApplication && existingApplication.status !== "rejected") {
      throw new Error("You already have a pending or approved application");
    }

    return await ctx.db.insert("printerApplications", {
      userId,
      ...args,
      status: "pending",
      submittedAt: Date.now(),
    });
  },
});

export const getUserPrinterApplication = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("printerApplications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

export const getActivePrinters = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("printers")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
  },
});

export const getPrintersByLocation = query({
  args: {
    country: v.optional(v.string()),
    state: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.country) {
      return await ctx.db
        .query("printers")
        .withIndex("by_location", (q) => q.eq("location.country", args.country!))
        .collect();
    }
    
    return await ctx.db.query("printers").collect();
  },
});

export const findNearestPrinter = query({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    materials: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const activePrinters = await ctx.db
      .query("printers")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    // Filter printers that can handle the required materials
    const compatiblePrinters = activePrinters.filter(printer =>
      args.materials.every(material => 
        printer.capabilities.materials.includes(material)
      )
    );

    if (compatiblePrinters.length === 0) {
      return null;
    }

    // Calculate distances and find nearest
    const printersWithDistance = compatiblePrinters.map(printer => {
      const distance = calculateDistance(
        args.latitude,
        args.longitude,
        printer.location.latitude,
        printer.location.longitude
      );
      return { ...printer, distance };
    });

    // Sort by distance and return the nearest
    printersWithDistance.sort((a, b) => a.distance - b.distance);
    return printersWithDistance[0];
  },
});

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const getPrinterStats = query({
  args: {},
  handler: async (ctx) => {
    const allPrinters = await ctx.db.query("printers").collect();
    const activePrinters = allPrinters.filter(p => p.status === "active");
    
    // Group by country
    const printersByCountry = activePrinters.reduce((acc, printer) => {
      const country = printer.location.country;
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPrinters: allPrinters.length,
      activePrinters: activePrinters.length,
      printersByCountry,
      averageRating: activePrinters.reduce((sum, p) => sum + p.rating, 0) / activePrinters.length || 0,
      totalCompletedOrders: activePrinters.reduce((sum, p) => sum + p.completedOrders, 0),
    };
  },
});
