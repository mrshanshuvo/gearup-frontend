import { z } from "zod";

export const stripeCardPaymentSchema = z.object({
  cardNumber: z
    .string()
    .min(1, { error: "Card number is required" })
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => /^\d{16}$/.test(val), {
      message: "Card number must be 16 digits",
    }),
  cardExpiry: z
    .string()
    .min(1, { error: "Expiry date is required" })
    .refine((val) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(val), {
      message: "Expiry format must be MM/YY (e.g. 12/28)",
    }),
  cardCvc: z
    .string()
    .min(1, { error: "CVC is required font-mono" })
    .refine((val) => /^\d{3,4}$/.test(val), {
      message: "CVC must be 3 or 4 digits",
    }),
});

export type StripeCardPaymentInput = z.infer<typeof stripeCardPaymentSchema>;
