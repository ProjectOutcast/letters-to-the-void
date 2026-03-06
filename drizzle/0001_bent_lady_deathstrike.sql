CREATE TABLE `vents` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL
);
