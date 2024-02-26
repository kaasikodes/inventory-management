-- CreateTable
CREATE TABLE `PaymentTerm` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PaymentTerm_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SupplierProfile` ADD CONSTRAINT `SupplierProfile_paymentTermId_fkey` FOREIGN KEY (`paymentTermId`) REFERENCES `PaymentTerm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierProfile` ADD CONSTRAINT `SupplierProfile_creditLimitId_fkey` FOREIGN KEY (`creditLimitId`) REFERENCES `CreditLimit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
