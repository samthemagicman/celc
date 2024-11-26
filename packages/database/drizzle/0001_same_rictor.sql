CREATE TABLE `user_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` text NOT NULL,
	`eventId` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON UPDATE no action ON DELETE cascade
);
