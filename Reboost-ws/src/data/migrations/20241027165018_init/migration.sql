-- CreateTable
CREATE TABLE `plaatsen` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `naam` VARCHAR(191) NOT NULL,
    `straat` VARCHAR(191) NOT NULL,
    `huisnummer` VARCHAR(255) NOT NULL,
    `postcode` VARCHAR(255) NOT NULL,
    `gemeente` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evenementen` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `naam` VARCHAR(191) NOT NULL,
    `datum` DATETIME(0) NOT NULL,
    `auteur_id` INTEGER UNSIGNED NOT NULL,
    `plaats_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gebruikers` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `wachtwoord` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `evenementen` ADD CONSTRAINT `fk_evenement_plaats` FOREIGN KEY (`plaats_id`) REFERENCES `plaatsen`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `evenementen` ADD CONSTRAINT `fk_evenement_gebruiker` FOREIGN KEY (`auteur_id`) REFERENCES `gebruikers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
