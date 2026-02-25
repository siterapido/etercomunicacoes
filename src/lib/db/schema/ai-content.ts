import { pgTable, uuid, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { contentTypeEnum } from "./enums";
import { projects } from "./projects";
import { users } from "./users";

export const aiGenerations = pgTable("ai_generations", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  userId: uuid("user_id").references(() => users.id),
  contentType: contentTypeEnum("content_type").notNull(),
  prompt: text("prompt").notNull(),
  result: text("result").notNull(),
  model: varchar("model", { length: 100 }).notNull().default("openai/gpt-4o-mini"),
  tokensUsed: integer("tokens_used"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const aiGenerationsRelations = relations(aiGenerations, ({ one }) => ({
  project: one(projects, {
    fields: [aiGenerations.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [aiGenerations.userId],
    references: [users.id],
  }),
}));
