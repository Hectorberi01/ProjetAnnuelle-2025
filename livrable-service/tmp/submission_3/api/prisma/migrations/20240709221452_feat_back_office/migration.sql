/*
  Warnings:

  - You are about to drop the column `created_at` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `membership_date` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `organizations` table. All the data in the column will be lost.
  - Added the required column `role` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `members` DROP COLUMN `created_at`,
    DROP COLUMN `membership_date`,
    DROP COLUMN `type`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `membershipDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `role` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `organizations` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
