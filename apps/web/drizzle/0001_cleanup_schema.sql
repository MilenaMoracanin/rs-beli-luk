ALTER TABLE `seed_inventory` DROP COLUMN `notes`;--> statement-breakpoint
ALTER TABLE `planting_logs` DROP COLUMN `notes`;--> statement-breakpoint
ALTER TABLE `harvests` DROP COLUMN `notes`;--> statement-breakpoint
ALTER TABLE `fields` DROP COLUMN `latitude`;--> statement-breakpoint
ALTER TABLE `fields` DROP COLUMN `longitude`;--> statement-breakpoint
DROP TABLE `journal_entries`;
