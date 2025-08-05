-- CreateTable
CREATE TABLE `gereedschap` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `naam` VARCHAR(255) NOT NULL,
    `beschrijving` TEXT NOT NULL,
    `beschikbaar` BOOLEAN NOT NULL DEFAULT true,
    `evenement_id` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `idx_gereedschap_naam_uniek`(`naam`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `gereedschap` ADD CONSTRAINT `gereedschap_evenement_id_fkey` FOREIGN KEY (`evenement_id`) REFERENCES `evenementen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
