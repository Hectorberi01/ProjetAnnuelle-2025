/*
  Warnings:

  - You are about to drop the column `url` on the `documents` table. All the data in the column will be lost.
  - Added the required column `file` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `documents` DROP COLUMN `url`,
    ADD COLUMN `file` LONGBLOB NOT NULL;
