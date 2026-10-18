-- À importer une seule fois dans la base Hostinger via phpMyAdmin.
-- Le site stocke ses trois photos modifiables dans gallery.image_data.

CREATE TABLE `gallery` (
  `slot` varchar(32) NOT NULL,
  `image_data` longtext NOT NULL,
  `mime_type` varchar(40) NOT NULL,
  `alt` text NOT NULL,
  `updated_at` bigint NOT NULL,
  CONSTRAINT `gallery_slot` PRIMARY KEY (`slot`)
);

CREATE TABLE `quotes` (
  `id` varchar(36) NOT NULL,
  `created_at` bigint NOT NULL,
  `name` text NOT NULL,
  `email` text,
  `phone` text,
  `city` text NOT NULL,
  `service` text NOT NULL,
  `details` text NOT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'nouveau',
  CONSTRAINT `quotes_id` PRIMARY KEY (`id`)
);

CREATE TABLE `rate_limits` (
  `key` varchar(128) NOT NULL,
  `count` int NOT NULL,
  `expires_at` bigint NOT NULL,
  CONSTRAINT `rate_limits_key` PRIMARY KEY (`key`)
);

CREATE TABLE `reviews` (
  `id` varchar(36) NOT NULL,
  `created_at` bigint NOT NULL,
  `author` text NOT NULL,
  `city` text,
  `rating` int NOT NULL,
  `message` text NOT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'pending',
  CONSTRAINT `reviews_id` PRIMARY KEY (`id`)
);
