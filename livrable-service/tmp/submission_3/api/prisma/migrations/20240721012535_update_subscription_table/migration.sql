-- AlterTable
ALTER TABLE `donations` ADD COLUMN `recurring` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `stripePaymentId` VARCHAR(191) NULL;
