import { z } from 'zod';

export const shopSchema = z.object({
  name: z.string()
    .min(3, { message: "Shop name must be at least 3 characters" })
    .max(100, { message: "Shop name too long" }),
  address: z.string()
    .min(5, { message: "Address must be at least 5 characters" })
    .max(200, { message: "Address too long" })
    .optional()
    .or(z.literal('')),
  contactNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format" })
    .optional()
    .or(z.literal('')),
  adminUsername: z.string()
    .min(3, { message: "Admin username must be at least 3 characters" })
    .max(30, { message: "Username too long" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain alphanumeric and underscores" })
    .optional(), // Optional for updates
  adminPassword: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
    .optional(), // Optional for updates
  adminFullName: z.string()
    .min(3, { message: "Full name must be at least 3 characters" })
    .optional(),
});
