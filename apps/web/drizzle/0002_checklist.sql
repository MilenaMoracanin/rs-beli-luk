CREATE TABLE `checklist_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`planting_id` integer NOT NULL,
	`item_key` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`completed_at` text,
	`field_values` text DEFAULT '{}' NOT NULL,
	`estimated_cost_rsd` real,
	`actual_cost_rsd` real,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`planting_id`) REFERENCES `plantings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `checklist_items_planting_key` ON `checklist_items` (`planting_id`, `item_key`);
