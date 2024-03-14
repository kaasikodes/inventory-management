-- DropForeignKey
ALTER TABLE `permissionsonusergroups` DROP FOREIGN KEY `PermissionsOnUserGroups_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `permissionsonusergroups` DROP FOREIGN KEY `PermissionsOnUserGroups_userGroupId_fkey`;

-- AddForeignKey
ALTER TABLE `PermissionsOnUserGroups` ADD CONSTRAINT `PermissionsOnUserGroups_userGroupId_fkey` FOREIGN KEY (`userGroupId`) REFERENCES `UserGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PermissionsOnUserGroups` ADD CONSTRAINT `PermissionsOnUserGroups_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
