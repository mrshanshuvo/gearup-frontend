import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters long" })
    .optional(),
  bio: z
    .string()
    .max(500, { error: "Bio cannot exceed 500 characters" })
    .optional(),
  profile_image: z
    .union([z.url({ error: "Invalid URL format" }), z.literal("")])
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
