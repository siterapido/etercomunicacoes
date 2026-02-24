import { z } from "zod";

export const createTaskSchema = z.object({
  projectId: z.string().uuid("ID do projeto inválido"),
  columnId: z.string().uuid("ID da coluna inválido"),
  title: z
    .string()
    .min(1, "O título é obrigatório")
    .max(500, "O título deve ter no máximo 500 caracteres"),
  description: z.string().optional(),
  priority: z
    .enum(["urgent", "high", "medium", "low"])
    .optional()
    .default("medium"),
  dueDate: z.string().optional(),
  assigneeIds: z.array(z.string().uuid()).optional().default([]),
});

export const updateTaskSchema = createTaskSchema.partial();

export const moveTaskSchema = z.object({
  taskId: z.string().uuid("ID da tarefa inválido"),
  destinationColumnId: z.string().uuid("ID da coluna de destino inválido"),
  newPosition: z.number().int().min(0, "Posição deve ser um número positivo"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type MoveTaskInput = z.infer<typeof moveTaskSchema>;
