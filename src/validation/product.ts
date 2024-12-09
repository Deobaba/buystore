// src/validation/product.ts
import * as z from 'zod';

export const productSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  productDescription: z.string().min(1, "Product description is required"),
  images: z.array(z.instanceof(File)).optional(),
  category: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be positive"),
  sellerInfo: z.string().optional(),
  externalLink: z.string().url("Enter a valid URL").optional(),
  referralCode: z.string().optional(),
  seoMetadata: z.string().optional(),
});

export type ProductData = z.infer<typeof productSchema>;
