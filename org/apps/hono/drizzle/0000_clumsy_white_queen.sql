CREATE TABLE `auth` (
	`key` varchar(36) NOT NULL,
	CONSTRAINT `auth_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` varchar(255) NOT NULL,
	`phone` varchar(255) NOT NULL,
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
