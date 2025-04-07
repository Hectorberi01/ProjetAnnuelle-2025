/*
  Warnings:

  - You are about to drop the column `employmentType` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `validityDays` on the `membershiptypes` table. All the data in the column will be lost.
  - The primary key for the `reset_password_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `reset_password_tokens` table. All the data in the column will be lost.
  - Added the required column `duration` to the `membershiptypes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `members` DROP COLUMN `employmentType`;

-- AlterTable
ALTER TABLE `membershiptypes` DROP COLUMN `validityDays`,
    ADD COLUMN `duration` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `reset_password_tokens` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`userId`);
