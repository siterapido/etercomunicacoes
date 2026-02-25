import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { approvalStatusEnum } from "./enums";
import { tasks } from "./pipeline";
import { users } from "./users";
import { projects } from "./projects";

export const approvals = pgTable("approvals", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  requestedBy: uuid("requested_by").references(() => users.id),
  status: approvalStatusEnum("status").notNull().default("pending"),
  clientEmail: varchar("client_email", { length: 255 }),
  clientName: varchar("client_name", { length: 255 }),
  publicToken: varchar("public_token", { length: 100 }).notNull().unique(),
  notes: text("notes"),
  clientFeedback: text("client_feedback"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  respondedAt: timestamp("responded_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const approvalsRelations = relations(approvals, ({ one }) => ({
  task: one(tasks, {
    fields: [approvals.taskId],
    references: [tasks.id],
  }),
  project: one(projects, {
    fields: [approvals.projectId],
    references: [projects.id],
  }),
  requestedByUser: one(users, {
    fields: [approvals.requestedBy],
    references: [users.id],
  }),
}));
