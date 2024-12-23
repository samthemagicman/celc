ALTER TABLE `event` ADD `maxSignupCount` integer;--> statement-breakpoint
CREATE UNIQUE INDEX `user_events_userId_eventId_unique` ON `user_events` (`userId`,`eventId`);