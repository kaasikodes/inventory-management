/*
  Warnings:

  - Added the required column `availableAmount` to the `InventoryItemSupplyRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `inventoryitemsupplyrecord` ADD COLUMN `availableAmount` INTEGER NOT NULL;
