-- AddForeignKey
ALTER TABLE `InventoryItem` ADD CONSTRAINT `InventoryItem_measurementUnitId_fkey` FOREIGN KEY (`measurementUnitId`) REFERENCES `MeasurementUnit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
