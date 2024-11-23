CREATE TABLE `event` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`location` text,
	`startHour` real NOT NULL,
	`endHour` real NOT NULL,
	`day` integer NOT NULL,
	`backgroundColor` text
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL
);
