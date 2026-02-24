import { z } from "zod";

export const createClientSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(255, "O nome deve ter no máximo 255 caracteres"),
  contactName: z.string().max(255).optional(),
  contactEmail: z
    .string()
    .email("Email inválido")
    .optional()
    .or(z.literal("")),
  brandColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor deve estar no formato hexadecimal (#RRGGBB)")
    .optional()
    .or(z.literal("")),
  toneOfVoice: z.string().optional(),
});

export const updateClientSchema = createClientSchema.partial();

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
