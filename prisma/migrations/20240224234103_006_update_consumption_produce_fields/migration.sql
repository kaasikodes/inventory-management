-- AlterTable
ALTER TABLE `inventoryitemconsumptionrecord` MODIFY `amountProduced` INTEGER NULL DEFAULT 0,
    MODIFY `produceConditionId` VARCHAR(191) NULL;
