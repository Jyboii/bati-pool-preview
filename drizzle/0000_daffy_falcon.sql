CREATE TABLE `gallery` (
	`slot` text PRIMARY KEY NOT NULL,
	`object_key` text NOT NULL,
	`alt` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`city` text NOT NULL,
	`service` text NOT NULL,
	`details` text NOT NULL,
	`status` text DEFAULT 'nouveau' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`author` text NOT NULL,
	`city` text,
	`rating` integer NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL
);
