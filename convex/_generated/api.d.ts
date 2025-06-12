/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as aiCommunications from "../aiCommunications.js";
import type * as auth from "../auth.js";
import type * as conceptImages from "../conceptImages.js";
import type * as contact from "../contact.js";
import type * as http from "../http.js";
import type * as models from "../models.js";
import type * as newsletter from "../newsletter.js";
import type * as orders from "../orders.js";
import type * as payments from "../payments.js";
import type * as printers from "../printers.js";
import type * as router from "../router.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  aiCommunications: typeof aiCommunications;
  auth: typeof auth;
  conceptImages: typeof conceptImages;
  contact: typeof contact;
  http: typeof http;
  models: typeof models;
  newsletter: typeof newsletter;
  orders: typeof orders;
  payments: typeof payments;
  printers: typeof printers;
  router: typeof router;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
