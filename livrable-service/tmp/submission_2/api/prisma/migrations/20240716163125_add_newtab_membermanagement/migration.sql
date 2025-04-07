/*
  Warnings:

  - You are about to drop the column `membershipType` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `members` DROP COLUMN `membershipType`,
    DROP COLUMN `status`,
    ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'member',
    MODIFY `employmentType` VARCHAR(191) NULL DEFAULT 'NULL';

-- CreateTable
CREATE TABLE `Memberships` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL DEFAULT 'volunteer',
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NULL,
    `memberId` INTEGER NOT NULL,
    `membershipTypeId` INTEGER NOT NULL,

    UNIQUE INDEX `Memberships_memberId_key`(`memberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL,
    `paymentDate` DATETIME(3) NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `isPaid` BOOLEAN NOT NULL DEFAULT false,
    `membershipId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MembershipTypes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `duration` INTEGER NOT NULL,
    `fee` DOUBLE NOT NULL,
    `organizationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Memberships` ADD CONSTRAINT `Memberships_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Memberships` ADD CONSTRAINT `Memberships_membershipTypeId_fkey` FOREIGN KEY (`membershipTypeId`) REFERENCES `MembershipTypes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscriptions` ADD CONSTRAINT `Subscriptions_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `Memberships`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MembershipTypes` ADD CONSTRAINT `MembershipTypes_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
