CREATE TABLE `admin_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_email_unique` ON `admin_users` (`email`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_email` text NOT NULL,
	`action` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`metadata` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`type` text DEFAULT 'contact' NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`subject` text NOT NULL,
	`body` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`handled_at` integer,
	`handled_by` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `messages_reference_unique` ON `messages` (`reference`);--> statement-breakpoint
CREATE INDEX `message_status_idx` ON `messages` (`status`);--> statement-breakpoint
CREATE INDEX `message_created_idx` ON `messages` (`created_at`);--> statement-breakpoint
CREATE TABLE `quittance_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`public_token` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`client_name` text NOT NULL,
	`client_email` text NOT NULL,
	`client_phone` text NOT NULL,
	`formation` text NOT NULL,
	`period_start` text NOT NULL,
	`period_end` text NOT NULL,
	`amount` integer NOT NULL,
	`payment_method` text NOT NULL,
	`payment_date` text NOT NULL,
	`payment_ref` text,
	`notes` text,
	`quittance_number` text,
	`consent_at` integer NOT NULL,
	`reviewed_at` integer,
	`reviewed_by` text,
	`rejection_reason` text,
	`email_status` text DEFAULT 'pending' NOT NULL,
	`email_sent_at` integer,
	`email_error` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `quittance_requests_reference_unique` ON `quittance_requests` (`reference`);--> statement-breakpoint
CREATE UNIQUE INDEX `quittance_requests_public_token_unique` ON `quittance_requests` (`public_token`);--> statement-breakpoint
CREATE UNIQUE INDEX `quittance_requests_quittance_number_unique` ON `quittance_requests` (`quittance_number`);--> statement-breakpoint
CREATE INDEX `quittance_status_idx` ON `quittance_requests` (`status`);--> statement-breakpoint
CREATE INDEX `quittance_created_idx` ON `quittance_requests` (`created_at`);