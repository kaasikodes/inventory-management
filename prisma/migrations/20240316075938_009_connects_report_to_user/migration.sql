-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_generatedBy_fkey` FOREIGN KEY (`generatedBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
