import { pgTable, serial, text, real, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  items: json("items").$type<Array<{productId: number; quantity: number; price: number; title: string; selectedSize?: string; selectedColor?: string}>>().notNull().default([]),
  total: real("total").notNull(),
  status: text("status").notNull().default("pending"),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryWilaya: text("delivery_wilaya").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  deliveryFee: real("delivery_fee").notNull().default(500),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
