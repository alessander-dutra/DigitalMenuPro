import { pgTable, text, serial, decimal, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  available: integer("available").notNull().default(1),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryType: text("delivery_type").notNull(), // 'delivery' or 'pickup'
  address: text("address"),
  addressNumber: text("address_number"),
  complement: text("complement"),
  paymentMethod: text("payment_method").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).notNull().default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("preparing"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  menuItemId: integer("menu_item_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull().default("Utensils"),
  minItems: integer("min_items").notNull().default(0),
  maxItems: integer("max_items").notNull().default(100),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const storeSettings = pgTable("store_settings", {
  id: serial("id").primaryKey(),
  storeName: text("store_name").notNull().default("Sabor Digital"),
  storePhone: text("store_phone").notNull().default("(11) 99999-9999"),
  storeEmail: text("store_email").notNull().default("contato@sabordigital.com"),
  storeAddress: text("store_address").notNull().default("Rua das Flores, 123 - Centro"),
  isOpen: integer("is_open").notNull().default(1), // 1 = aberto, 0 = fechado
  openingTime: text("opening_time").notNull().default("08:00"),
  closingTime: text("closing_time").notNull().default("22:00"),
  allowPickup: integer("allow_pickup").notNull().default(1), // 1 = permite, 0 = não permite
  allowCheckout: integer("allow_checkout").notNull().default(1), // 1 = permite checkout, 0 = só visualização
  allowScheduling: integer("allow_scheduling").notNull().default(1), // 1 = permite agendamento, 0 = não permite
  deliveryTime: text("delivery_time").notNull().default("30-45 min"),
  pickupTime: text("pickup_time").notNull().default("15-20 min"),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).notNull().default("5.00"),
  paymentMethods: text("payment_methods").notNull().default("card,pix,cash"), // comma separated
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  menuItemId: integer("menu_item_id").notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }).notNull(),
  promotionalPrice: decimal("promotional_price", { precision: 10, scale: 2 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scheduledOrders = pgTable("scheduled_orders", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  scheduledDateTime: timestamp("scheduled_date_time").notNull(),
  scheduledType: text("scheduled_type").notNull(), // 'delivery' or 'pickup'
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const itemReviews = pgTable("item_reviews", {
  id: serial("id").primaryKey(),
  menuItemId: integer("menu_item_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export const insertStoreSettingsSchema = createInsertSchema(storeSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertPromotionSchema = createInsertSchema(promotions).omit({
  id: true,
  createdAt: true,
});

export const insertScheduledOrderSchema = createInsertSchema(scheduledOrders).omit({
  id: true,
  createdAt: true,
});

export const insertItemReviewSchema = createInsertSchema(itemReviews).omit({
  id: true,
  createdAt: true,
});

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type StoreSettings = typeof storeSettings.$inferSelect;
export type InsertStoreSettings = z.infer<typeof insertStoreSettingsSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Promotion = typeof promotions.$inferSelect;
export type InsertPromotion = z.infer<typeof insertPromotionSchema>;
export type ScheduledOrder = typeof scheduledOrders.$inferSelect;
export type InsertScheduledOrder = z.infer<typeof insertScheduledOrderSchema>;
export type ItemReview = typeof itemReviews.$inferSelect;
export type InsertItemReview = z.infer<typeof insertItemReviewSchema>;
