/*
  Warnings:

  - Added the required column `stripeSubscriptionId` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subscriptions` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `stripeSubscriptionId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
