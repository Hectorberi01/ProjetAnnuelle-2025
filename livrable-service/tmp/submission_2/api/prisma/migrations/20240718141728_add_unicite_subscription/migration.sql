/*
  Warnings:

  - A unique constraint covering the columns `[memberId,membershipTypeId]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `organizations` DROP FOREIGN KEY `organizations_ownerId_fkey`;

-- CreateIndex
CREATE UNIQUE INDEX `subscriptions_memberId_membershipTypeId_key` ON `subscriptions`(`memberId`, `membershipTypeId`);

-- AddForeignKey
ALTER TABLE `organizations` ADD CONSTRAINT `organizations_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
