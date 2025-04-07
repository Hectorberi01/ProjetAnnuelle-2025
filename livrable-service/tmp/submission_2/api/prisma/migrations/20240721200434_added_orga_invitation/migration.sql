
-- CreateTable
CREATE TABLE `organization_invitation` (
    `organizationsId` INTEGER NOT NULL,
    `uuid` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`organizationsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `organization_invitation` ADD CONSTRAINT `organization_invitation_organizationsId_fkey` FOREIGN KEY (`organizationsId`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
