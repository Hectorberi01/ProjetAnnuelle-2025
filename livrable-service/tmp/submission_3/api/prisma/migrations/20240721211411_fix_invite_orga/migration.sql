/*
  Warnings:

  - The primary key for the `organization_invitation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `organizationsId` on the `organization_invitation` table. All the data in the column will be lost.
  - Added the required column `organizationId` to the `organization_invitation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `organization_invitation` DROP FOREIGN KEY `organization_invitation_organizationsId_fkey`;

-- AlterTable
ALTER TABLE `organization_invitation` DROP PRIMARY KEY,
    DROP COLUMN `organizationsId`,
    ADD COLUMN `organizationId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`organizationId`);

-- AddForeignKey
ALTER TABLE `organization_invitation` ADD CONSTRAINT `organization_invitation_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
