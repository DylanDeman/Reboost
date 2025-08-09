-- DropForeignKey
ALTER TABLE `gereedschap` DROP FOREIGN KEY `gereedschap_evenement_id_fkey`;

-- AddForeignKey
ALTER TABLE `gereedschap` ADD CONSTRAINT `gereedschap_evenement_id_fkey` FOREIGN KEY (`evenement_id`) REFERENCES `evenementen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
