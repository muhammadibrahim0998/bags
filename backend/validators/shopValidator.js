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
    .optional(),
  adminPassword: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
    .optional(),
  adminFullName: z.string()
    .min(3, { message: "Full name must be at least 3 characters" })
    .optional(),
  adminEmail: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
  adminPhone: z.string().optional().or(z.literal('')),
  logoUrl: z.string().url({ message: "Invalid URL format" }).optional().or(z.literal('')),
});

export const validateShop = (req, res, next) => {
  try {
    shopSchema.parse(req.body);
    next();
  } catch (error) {
    if (error && error.name === 'ZodError') {
      return res.status(400).json({ 
        message: "Validation Error", 
        errors: (error.errors || error.issues || []).map(err => ({
          field: err.path && err.path[0] ? err.path[0] : 'unknown',
          message: err.message
        }))
      });
    }
    next(error);
  }
};
