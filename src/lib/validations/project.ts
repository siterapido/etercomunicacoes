import { z } from "zod";

export const createProjectSchema = z.object({
  clientId: z.string().uuid("ID do cliente inválido"),
  name: z
    .string()
    .min(1, "O nome é obrigatório")
    .max(255, "O nome deve ter no máximo 255 caracteres"),
  description: z.string().optional(),
  status: z
    .enum(["active", "paused", "completed", "archived"])
    .optional()
    .default("active"),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
