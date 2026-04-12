import { z } from 'zod';

export const productSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name too long" }),
  category: z.string()
    .min(1, { message: "Category is required" }),
  price: z.coerce.number()
    .positive({ message: "Price must be greater than 0" }),
  costPrice: z.coerce.number()
    .nonnegative({ message: "Cost price cannot be negative" })
    .optional(),
  stock: z.coerce.number()
    .nonnegative({ message: "Stock cannot be negative" }),
  minStock: z.coerce.number()
    .nonnegative({ message: "Minimum stock alert cannot be negative" })
    .optional(),
  description: z.string()
    .max(500, { message: "Description too long" })
    .optional()
    .or(z.literal('')),
  images: z.array(z.string().url())
    .max(5, { message: "Maximum 5 images allowed" })
    .optional(),
  mfgDate: z.string()
    .optional()
    .or(z.literal('')),
  expiryDate: z.string()
    .optional()
    .or(z.literal('')),
});

export const validateProduct = (req, res, next) => {
  try {
    productSchema.parse(req.body);
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
