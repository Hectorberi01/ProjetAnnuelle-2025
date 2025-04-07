/*
  Warnings:

  - You are about to drop the column `employmentType` on the `members` table. All the data in the column will be lost.
  - You are about to drop the `MembershipTypes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Memberships` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,organizationId]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `organizations` table without a default value. This is not possible if the table is not empty.
*/

-- DropForeignKey
ALTER TABLE `MembershipTypes` DROP FOREIGN KEY `MembershipTypes_organizationId_fkey`;

-- DropForeignKey
ALTER TABLE `Memberships` DROP FOREIGN KEY `Memberships_memberId_fkey`;

-- DropForeignKey
ALTER TABLE `Memberships` DROP FOREIGN KEY `Memberships_membershipTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `Subscriptions` DROP FOREIGN KEY `Subscriptions_membershipId_fkey`;

-- AlterTable
ALTER TABLE `members` DROP COLUMN `employmentType`,
    ADD COLUMN `status` ENUM('VOLUNTEER', 'SUBSCRIBER', 'INTERN', 'EMPLOYEE') NOT NULL DEFAULT 'VOLUNTEER',
    MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'volunteer';

-- AlterTable
ALTER TABLE `organizations` ADD COLUMN `ownerId` INTEGER;

-- DropTable
DROP TABLE `MembershipTypes`;

-- DropTable
DROP TABLE `Memberships`;

-- DropTable
DROP TABLE `Subscriptions`;

-- CreateTable
CREATE TABLE `membershiptypes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `validityDays` INTEGER NOT NULL,
    `organizationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberId` INTEGER NOT NULL,
    `membershipTypeId` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NOT NULL,
    `paymentStatus` ENUM('PENDING', 'PAID', 'FAILED') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `members_userId_organizationId_key` ON `members`(`userId`, `organizationId`);

-- UpdateData (assurez-vous qu'il y a au moins un membre avec id=1)
UPDATE `organizations` SET `ownerId` = 1 WHERE `ownerId` IS NULL;

-- AlterColumn
ALTER TABLE `organizations` MODIFY `ownerId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `organizations` ADD CONSTRAINT `organizations_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `membershiptypes` ADD CONSTRAINT `membershiptypes_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_membershipTypeId_fkey` FOREIGN KEY (`membershipTypeId`) REFERENCES `membershiptypes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;