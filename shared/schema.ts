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
  productionPrinter: text("production_printer"), // Nome da impressora de produção
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
  defaultPrinter: text("default_printer").default("none"), // Impressora padrão para categoria
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
  allowReviews: integer("allow_reviews").notNull().default(1), // 1 = permite avaliações, 0 = não permite
  allowOrderHistory: integer("allow_order_history").notNull().default(1), // 1 = permite histórico, 0 = não permite
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

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  discountType: text("discount_type").notNull(), // 'percentage' or 'fixed'
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  minOrderValue: decimal("min_order_value", { precision: 10, scale: 2 }).default("0.00"),
  maxUses: integer("max_uses").default(0), // 0 = unlimited
  currentUses: integer("current_uses").notNull().default(0),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const happyHourPromotions = pgTable("happy_hour_promotions", {
  id: serial("id").primaryKey(),
  menuItemId: integer("menu_item_id").notNull(),
  name: text("name").notNull(),
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).notNull(),
  startTime: text("start_time").notNull(), // HH:MM format
  endTime: text("end_time").notNull(), // HH:MM format
  daysOfWeek: text("days_of_week").notNull(), // comma separated: 0=Sunday, 1=Monday, etc
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customerProfiles = pgTable("customer_profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  address: text("address"),
  lastOrderDate: timestamp("last_order_date"),
  totalOrders: integer("total_orders").notNull().default(0),
  favoriteItems: text("favorite_items"), // JSON string of menu item IDs
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderHistory = pgTable("order_history", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id"),
  orderNumber: text("order_number").notNull(),
  items: text("items").notNull(), // JSON string
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(),
  orderDate: timestamp("order_date").defaultNow().notNull(),
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

export const insertCouponSchema = createInsertSchema(coupons).omit({
  id: true,
  currentUses: true,
  createdAt: true,
});

export const insertHappyHourPromotionSchema = createInsertSchema(happyHourPromotions).omit({
  id: true,
  createdAt: true,
});

export const insertCustomerProfileSchema = createInsertSchema(customerProfiles).omit({
  id: true,
  lastOrderDate: true,
  totalOrders: true,
  createdAt: true,
});

export const insertOrderHistorySchema = createInsertSchema(orderHistory).omit({
  id: true,
  orderDate: true,
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
export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type HappyHourPromotion = typeof happyHourPromotions.$inferSelect;
export type InsertHappyHourPromotion = z.infer<typeof insertHappyHourPromotionSchema>;
export type CustomerProfile = typeof customerProfiles.$inferSelect;
export type InsertCustomerProfile = z.infer<typeof insertCustomerProfileSchema>;
export type OrderHistory = typeof orderHistory.$inferSelect;
export type InsertOrderHistory = z.infer<typeof insertOrderHistorySchema>;
