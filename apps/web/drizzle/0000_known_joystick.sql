CREATE TABLE `fields` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`width_m` real NOT NULL,
	`length_m` real NOT NULL,
	`area_m2` real NOT NULL,
	`latitude` real,
	`longitude` real,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `harvests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sector_id` integer NOT NULL,
	`planting_id` integer NOT NULL,
	`kg_harvested` real NOT NULL,
	`harvested_at` text NOT NULL,
	`notes` text,
	FOREIGN KEY (`sector_id`) REFERENCES `sectors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`planting_id`) REFERENCES `plantings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `journal_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sector_id` integer,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`photo_path` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`sector_id`) REFERENCES `sectors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `planting_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sector_id` integer NOT NULL,
	`seed_inventory_id` integer NOT NULL,
	`kg_planted` real NOT NULL,
	`planted_at` text NOT NULL,
	`notes` text,
	FOREIGN KEY (`sector_id`) REFERENCES `sectors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`seed_inventory_id`) REFERENCES `seed_inventory`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `plantings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`field_id` integer NOT NULL,
	`variety_id` text NOT NULL,
	`planting_start_date` text NOT NULL,
	`expected_harvest_date` text NOT NULL,
	`status` text DEFAULT 'planning' NOT NULL,
	FOREIGN KEY (`field_id`) REFERENCES `fields`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variety_id`) REFERENCES `varieties`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sectors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`field_id` integer NOT NULL,
	`name` text NOT NULL,
	`order_index` integer NOT NULL,
	`width_m` real NOT NULL,
	`length_m` real NOT NULL,
	`area_m2` real NOT NULL,
	`row_count` integer NOT NULL,
	`row_length_m` real NOT NULL,
	`status` text DEFAULT 'empty' NOT NULL,
	FOREIGN KEY (`field_id`) REFERENCES `fields`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `seed_inventory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`field_id` integer NOT NULL,
	`variety_id` text NOT NULL,
	`total_kg` real NOT NULL,
	`used_kg` real DEFAULT 0 NOT NULL,
	`notes` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`field_id`) REFERENCES `fields`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variety_id`) REFERENCES `varieties`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`planting_id` integer NOT NULL,
	`sector_id` integer,
	`phase` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`due_date` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`completed_at` text,
	FOREIGN KEY (`planting_id`) REFERENCES `plantings`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sector_id`) REFERENCES `sectors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `varieties` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`days_to_harvest` integer NOT NULL,
	`spacing_cm` integer NOT NULL,
	`row_spacing_cm` integer NOT NULL,
	`planting_depth_cm` integer NOT NULL,
	`yield_min_kg_per_ha` integer NOT NULL,
	`yield_max_kg_per_ha` integer NOT NULL,
	`description` text NOT NULL
);
