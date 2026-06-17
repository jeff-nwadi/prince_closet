import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  expiresAt: timestamp("expiresAt"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  orderNumber: text("orderNumber").notNull().unique(),
  status: text("status").notNull(), // 'delivered', 'in-transit', 'returned', 'processing'
  totalAmount: text("totalAmount").notNull(),
  shippingName: text("shippingName"),
  shippingAddress1: text("shippingAddress1"),
  shippingAddress2: text("shippingAddress2"),
  shippingCity: text("shippingCity"),
  shippingState: text("shippingState"),
  shippingPostalCode: text("shippingPostalCode"),
  shippingCountry: text("shippingCountry"),
  shippingPhone: text("shippingPhone"),
  shippingMethod: text("shippingMethod"),
  paymentStatus: text("paymentStatus").default("pending").notNull(), // 'pending', 'paid', 'failed'
  paymentReference: text("paymentReference"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("orderId").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: text("productId").notNull(), 
  productName: text("productName").notNull(),
  price: text("price").notNull(),
  quantity: text("quantity").notNull(),
  size: text("size"),
});

export const wishlist = pgTable("wishlist", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  productId: text("productId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const shipments = pgTable("shipments", {
  id: text("id").primaryKey(),
  orderId: text("orderId").notNull().references(() => orders.id, { onDelete: "cascade" }),
  status: text("status").notNull(),
  estimatedArrival: timestamp("estimatedArrival"),
  stepsJson: text("stepsJson"), // Store JSON string of steps
});
