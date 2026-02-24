import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "manager",
  "designer",
  "writer",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "active",
  "paused",
  "completed",
  "archived",
]);

export const taskPriorityEnum = pgEnum("task_priority", [
  "urgent",
  "high",
  "medium",
  "low",
]);

export const approvalStatusEnum = pgEnum("approval_status", [
  "pending",
  "approved",
  "changes_requested",
  "rejected",
]);

export const contentTypeEnum = pgEnum("content_type", [
  "caption",
  "script",
  "blog",
  "ad_copy",
  "email",
  "description",
]);
