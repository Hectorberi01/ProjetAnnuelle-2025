-- CreateTable
CREATE TABLE `java_versions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `versionName` VARCHAR(191) NOT NULL,
    `experimental` BOOLEAN NOT NULL,
    `file` LONGBLOB NOT NULL,

    UNIQUE INDEX `java_versions_versionName_key`(`versionName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
