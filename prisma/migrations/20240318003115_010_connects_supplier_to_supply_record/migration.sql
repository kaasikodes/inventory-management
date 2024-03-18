-- AddForeignKey
ALTER TABLE `InventoryItemSupplyRecord` ADD CONSTRAINT `InventoryItemSupplyRecord_supplierProfileId_fkey` FOREIGN KEY (`supplierProfileId`) REFERENCES `SupplierProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
