import { bigint, int, longtext, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

export const quotes = mysqlTable("quotes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  city: text("city").notNull(),
  service: text("service").notNull(),
  details: text("details").notNull(),
  status: varchar("status", { length: 32 }).notNull().default("nouveau"),
});

export const reviews = mysqlTable("reviews", {
  id: varchar("id", { length: 36 }).primaryKey(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  author: text("author").notNull(),
  city: text("city"),
  rating: int("rating").notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 32 }).notNull().default("pending"),
});

export const gallery = mysqlTable("gallery", {
  slot: varchar("slot", { length: 32 }).primaryKey(),
  imageData: longtext("image_data").notNull(),
  mimeType: varchar("mime_type", { length: 40 }).notNull(),
  alt: text("alt").notNull(),
  updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
});

export const rateLimits = mysqlTable("rate_limits", {
  key: varchar("key", { length: 128 }).primaryKey(),
  count: int("count").notNull(),
  expiresAt: bigint("expires_at", { mode: "number" }).notNull(),
});
