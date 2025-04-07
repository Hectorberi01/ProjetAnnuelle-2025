-- AlterTable
ALTER TABLE `members` MODIFY `employmentType` VARCHAR(191) NULL DEFAULT 'NULL';

-- CreateTable
CREATE TABLE `activities_attendance` (
    `memberId` INTEGER NOT NULL,
    `activityId` INTEGER NOT NULL,

    PRIMARY KEY (`activityId`, `memberId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `activities_attendance` ADD CONSTRAINT `activities_attendance_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activities_attendance` ADD CONSTRAINT `activities_attendance_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `activities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
