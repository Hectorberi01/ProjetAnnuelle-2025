/*
  Warnings:

  - You are about to drop the `refreshToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `refreshToken` DROP FOREIGN KEY `refreshToken_user_id_fkey`;

-- DropTable
DROP TABLE `refreshToken`;

-- CreateTable
CREATE TABLE `refresh_token` (
    `id` VARCHAR(191) NOT NULL,
    `hashed_token` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `revoked` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `refresh_token_id_key`(`id`),
    INDEX `refreshToken_userId_fkey`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `refresh_token` ADD CONSTRAINT `refresh_token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
