-- DropIndex
DROP INDEX `members_userId_idx` ON `members`;


-- CreateTable
CREATE TABLE `ag_attendance` (
    `memberId` INTEGER NOT NULL,
    `agId` INTEGER NOT NULL,

    PRIMARY KEY (`agId`, `memberId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ag_attendance` ADD CONSTRAINT `ag_attendance_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ag_attendance` ADD CONSTRAINT `ag_attendance_agId_fkey` FOREIGN KEY (`agId`) REFERENCES `ags`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
