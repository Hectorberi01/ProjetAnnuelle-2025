-- AlterTable
ALTER TABLE `members` MODIFY `employmentType` VARCHAR(191) NULL DEFAULT 'NULL';

-- CreateIndex
CREATE INDEX `members_userId_idx` ON `members`(`userId`);
