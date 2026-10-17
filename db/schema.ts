import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const quotes = sqliteTable("quotes", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  city: text("city").notNull(),
  service: text("service").notNull(),
  details: text("details").notNull(),
  status: text("status").notNull().default("nouveau"),
});

export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at").notNull(),
  author: text("author").notNull(),
  city: text("city"),
  rating: integer("rating").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("pending"),
});

export const gallery = sqliteTable("gallery", {
  slot: text("slot").primaryKey(),
  objectKey: text("object_key").notNull(),
  alt: text("alt").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const rateLimits = sqliteTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  expiresAt: integer("expires_at").notNull(),
});
