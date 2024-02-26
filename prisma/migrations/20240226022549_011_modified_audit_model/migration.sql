/*
  Warnings:

  - You are about to drop the column `category` on the `audit` table. All the data in the column will be lost.
  - You are about to drop the column `entityId` on the `audit` table. All the data in the column will be lost.
  - You are about to drop the column `entityName` on the `audit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `audit` DROP COLUMN `category`,
    DROP COLUMN `entityId`,
    DROP COLUMN `entityName`;
