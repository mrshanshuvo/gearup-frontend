import { z } from "zod";

export const createGearSchema = z.object({
  name: z.string().min(1, { error: "Gear name is required" }),
  description: z
    .string()
    .min(10, { error: "Description must be at least 10 characters long" }),
  brand: z.string().min(1, { error: "Brand name is required" }),
  pricePerDay: z.coerce
    .number({ error: "Price per day must be a number" })
    .positive({ error: "Price per day must be greater than zero" }),
  stock: z.coerce
    .number({ error: "Stock must be a number" })
    .int({ error: "Stock must be a whole number" })
    .nonnegative({ error: "Stock cannot be negative" }),
  imageUrl: z
    .union([z.url({ error: "Invalid image URL format" }), z.literal("")])
    .optional(),
  categoryId: z.string().min(1, { error: "Please select a category" }),
});

export const updateGearSchema = createGearSchema.partial();

export type CreateGearInput = z.infer<typeof createGearSchema>;
export type UpdateGearInput = z.infer<typeof updateGearSchema>;
