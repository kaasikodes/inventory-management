/*
  Warnings:

  - A unique constraint covering the columns `[inputOutputRatioId]` on the table `InventoryItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `InventoryItem_inputOutputRatioId_key` ON `InventoryItem`(`inputOutputRatioId`);

-- AddForeignKey
ALTER TABLE `InventoryItem` ADD CONSTRAINT `InventoryItem_inputOutputRatioId_fkey` FOREIGN KEY (`inputOutputRatioId`) REFERENCES `InputOutputRatio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
