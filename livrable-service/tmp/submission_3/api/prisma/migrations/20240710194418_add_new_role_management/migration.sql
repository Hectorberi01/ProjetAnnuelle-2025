/*
  Warnings:

  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `members` ADD COLUMN `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `employmentType` VARCHAR(191) NULL DEFAULT 'NULL';

-- AlterTable
ALTER TABLE `users` DROP COLUMN `role`,
    ADD COLUMN `isSuperAdmin` BOOLEAN NOT NULL DEFAULT false;
