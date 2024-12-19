-- DropForeignKey
ALTER TABLE `evenementen` DROP FOREIGN KEY `fk_evenement_gebruiker`;

-- DropForeignKey
ALTER TABLE `evenementen` DROP FOREIGN KEY `fk_evenement_plaats`;

-- AddForeignKey
ALTER TABLE `evenementen` ADD CONSTRAINT `fk_evenement_plaats` FOREIGN KEY (`plaats_id`) REFERENCES `plaatsen`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `evenementen` ADD CONSTRAINT `fk_evenement_gebruiker` FOREIGN KEY (`auteur_id`) REFERENCES `gebruikers`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
