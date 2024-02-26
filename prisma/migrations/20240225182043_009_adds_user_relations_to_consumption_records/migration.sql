-- DropForeignKey
ALTER TABLE `inventoryitemconsumptionrecord` DROP FOREIGN KEY `InventoryItemConsumptionRecord_produceConditionId_fkey`;

-- AlterTable
ALTER TABLE `inventoryitemconsumptionrecord` ADD COLUMN `dateConsumed` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `InventoryItemConsumptionRecord` ADD CONSTRAINT `InventoryItemConsumptionRecord_produceConditionId_fkey` FOREIGN KEY (`produceConditionId`) REFERENCES `InventoryItemCondition`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryItemConsumptionRecord` ADD CONSTRAINT `InventoryItemConsumptionRecord_addedBy_fkey` FOREIGN KEY (`addedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryItemConsumptionRecord` ADD CONSTRAINT `InventoryItemConsumptionRecord_lastModifiedBy_fkey` FOREIGN KEY (`lastModifiedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
