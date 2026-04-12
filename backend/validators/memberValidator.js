import { z } from 'zod';

export const memberSchema = z.object({
  fullName: z.string()
    .min(3, { message: "Legal Identity requires at least 3 characters" })
    .max(50, { message: "Name exceeds protocol limit" })
    .regex(/^[a-zA-Z\s]*$/, { message: "Name can only contain alphabetic characters" }),
  
  username: z.string()
    .min(3, { message: "System index requires at least 3 characters" })
    .max(20, { message: "Index exceeds protocol limit" })
    .regex(/^[a-z0-9_]*$/, { message: "Index must be lowercase alphanumeric with underscores" }),
  
  password: z.string()
    .min(8, { message: "Access pass must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Requires at least one uppercase indicator" })
    .regex(/[a-z]/, { message: "Requires at least one lowercase indicator" })
    .regex(/[0-9]/, { message: "Requires at least one numeric indicator" })
    .optional()
    .or(z.literal('')),
  
  role: z.enum(['admin', 'cashier', 'salesman', 'shop_admin', 'super_admin'], {
    errorMap: () => ({ message: "Select a valid authorization tier" })
  }),
  
  preferredShift: z.enum(['day', 'night', 'both'], {
    errorMap: () => ({ message: "Select a valid operational rotation" })
  }).optional(),

  phoneNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid international signal format (E.164)" })
    .optional()
    .or(z.literal(''))
});

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
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
