/*
  Warnings:

  - You are about to drop the column `endDate` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `members` DROP COLUMN `endDate`,
    DROP COLUMN `startDate`,
    MODIFY `employmentType` VARCHAR(191) NULL DEFAULT 'NULL';
