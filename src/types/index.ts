import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  users,
  clients,
  projects,
  tasks,
  pipelineColumns,
  taskAttachments,
  taskComments,
  taskActivities,
} from "@/lib/db/schema";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Client = InferSelectModel<typeof clients>;
export type NewClient = InferInsertModel<typeof clients>;
export type Project = InferSelectModel<typeof projects>;
export type NewProject = InferInsertModel<typeof projects>;
export type Task = InferSelectModel<typeof tasks>;
export type NewTask = InferInsertModel<typeof tasks>;
export type PipelineColumn = InferSelectModel<typeof pipelineColumns>;
export type TaskAttachment = InferSelectModel<typeof taskAttachments>;
export type TaskComment = InferSelectModel<typeof taskComments>;
export type TaskActivity = InferSelectModel<typeof taskActivities>;

export type ProjectWithClient = Project & { client: Client };
export type TaskWithAssignees = Task & { assignees: { user: User }[] };
export type ColumnWithTasks = PipelineColumn & { tasks: TaskWithAssignees[] };
