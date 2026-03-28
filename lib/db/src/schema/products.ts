import { pgTable, serial, text, real, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  originalPrice: real("original_price"),
  currency: text("currency").notNull().default("DZD"),
  images: json("images").$type<string[]>().notNull().default([]),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  sizes: json("sizes").$type<string[]>().notNull().default([]),
  colors: json("colors").$type<string[]>().notNull().default([]),
  condition: text("condition").notNull().default("new"),
  brand: text("brand"),
  sellerId: integer("seller_id").notNull(),
  wilaya: text("wilaya").notNull(),
  city: text("city").notNull(),
  rating: real("rating"),
  reviewCount: integer("review_count").notNull().default(0),
  viewCount: integer("view_count").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  isNew: boolean("is_new").notNull().default(true),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
