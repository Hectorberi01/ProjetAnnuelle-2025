/*
  Warnings:

  - Added the required column `stripeProductId` to the `membershiptypes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `membershiptypes` ADD COLUMN `stripeProductId` VARCHAR(191) NOT NULL;
