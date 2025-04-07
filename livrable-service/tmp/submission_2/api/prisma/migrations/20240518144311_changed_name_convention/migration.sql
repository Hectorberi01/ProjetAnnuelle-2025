/*
  Warnings:

  - You are about to drop the column `organizationsId` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `organizationsId` on the `members` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organizationId]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `activities` DROP FOREIGN KEY `activities_organizationsId_fkey`;

-- DropForeignKey
ALTER TABLE `members` DROP FOREIGN KEY `members_organizationsId_fkey`;

-- AlterTable
ALTER TABLE `activities` DROP COLUMN `organizationsId`,
    ADD COLUMN `organizationId` INTEGER NULL;

-- AlterTable
ALTER TABLE `members` DROP COLUMN `organizationsId`,
    ADD COLUMN `organizationId` INTEGER NOT NULL;


-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activities` ADD CONSTRAINT `activities_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
