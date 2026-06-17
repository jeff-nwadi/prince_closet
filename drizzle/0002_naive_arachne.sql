ALTER TABLE "order_items" ADD COLUMN "size" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shippingName" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shippingAddress1" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shippingAddress2" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shippingCity" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shippingState" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shippingPostalCode" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shippingCountry" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shippingPhone" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shippingMethod" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "paymentStatus" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "paymentReference" text;