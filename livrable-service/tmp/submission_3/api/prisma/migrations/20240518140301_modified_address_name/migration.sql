/*
  Warnings:

  - You are about to drop the column `adress` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `adress` on the `organizations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `members` DROP COLUMN `adress`,
    ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `organizations` DROP COLUMN `adress`,
    ADD COLUMN `address` VARCHAR(191) NOT NULL;
