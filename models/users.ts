import { Timestamp } from "baby-stats-firebase/types";
import { z } from "zod";

export const ProviderData = z.object({
  providerId: z.string(),
  uid: z.string(),
  displayName: z.string().nullable(),
  email: z.string().email().nullable(),
  phoneNumber: z.string().nullable(),
  photoURL: z.string().url().nullable(),
});
export type ProviderData = z.infer<typeof ProviderData>;

export const User = z.object({
  uid: z.string(),
  email: z.string().email().nullable(),
  emailVerified: z.boolean(),
  displayName: z.string(),
  isAnonymous: z.boolean(),
  photoURL: z.string().url().nullable(),
  providerData: z.array(ProviderData),
  createdAt: z.instanceof(Timestamp),
  lastLoginAt: z.instanceof(Timestamp),
});
export type User = z.infer<typeof User>;
