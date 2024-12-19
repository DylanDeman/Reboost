/*
  Warnings:

  - A unique constraint covering the columns `[naam]` on the table `gebruikers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roles` to the `gebruikers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `gebruikers` ADD COLUMN `roles` JSON NOT NULL,
    MODIFY `wachtwoord` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `idx_gebruikersnaam_uniek` ON `gebruikers`(`naam`);
