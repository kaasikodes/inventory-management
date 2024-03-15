-- AddForeignKey
ALTER TABLE `InventoryItemSupplyRecord` ADD CONSTRAINT `InventoryItemSupplyRecord_addedBy_fkey` FOREIGN KEY (`addedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryItemSupplyRecord` ADD CONSTRAINT `InventoryItemSupplyRecord_lastModifiedBy_fkey` FOREIGN KEY (`lastModifiedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
