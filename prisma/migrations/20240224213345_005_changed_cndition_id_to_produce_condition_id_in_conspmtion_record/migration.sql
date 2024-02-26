/*
  Warnings:

  - You are about to drop the column `conditionId` on the `inventoryitemconsumptionrecord` table. All the data in the column will be lost.
  - Added the required column `produceConditionId` to the `InventoryItemConsumptionRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `inventoryitemconsumptionrecord` DROP FOREIGN KEY `InventoryItemConsumptionRecord_conditionId_fkey`;

-- AlterTable
ALTER TABLE `inventoryitemconsumptionrecord` DROP COLUMN `conditionId`,
    ADD COLUMN `produceConditionId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `InventoryItemConsumptionRecord` ADD CONSTRAINT `InventoryItemConsumptionRecord_produceConditionId_fkey` FOREIGN KEY (`produceConditionId`) REFERENCES `InventoryItemCondition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
