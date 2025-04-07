/*
  Warnings:

  - You are about to alter the column `amount` on the `membershiptypes` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.

*/
-- AlterTable
ALTER TABLE `members` MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'member';

-- AlterTable
ALTER TABLE `membershiptypes` MODIFY `amount` INTEGER NOT NULL;
