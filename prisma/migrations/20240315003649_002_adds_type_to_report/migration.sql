-- AlterTable
ALTER TABLE `report` ADD COLUMN `type` ENUM('INVENTORY_CONSUMPTION', 'INVENTORY_SUPPLY') NULL;