/*
  Warnings:

  - You are about to drop the column `created_at` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `membershipDate` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,organizationId]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `membershipType` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `activities` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `members` DROP COLUMN `address`,
    DROP COLUMN `email`,
    DROP COLUMN `membershipDate`,
    DROP COLUMN `name`,
    DROP COLUMN `phone`,
    DROP COLUMN `role`,
    ADD COLUMN `employmentType` VARCHAR(191) NULL DEFAULT 'volunteer',
    ADD COLUMN `endDate` DATETIME(3) NULL,
    ADD COLUMN `membershipType` VARCHAR(191) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `organizations` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `created_at`,
    DROP COLUMN `first_name`,
    DROP COLUMN `last_name`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `firstName` VARCHAR(191) NULL,
    ADD COLUMN `lastName` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NULL;
