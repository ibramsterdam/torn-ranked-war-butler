/*
  Warnings:

  - You are about to drop the column `factionsAmount` on the `DiscordServer` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DiscordServer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guildId" BIGINT NOT NULL,
    "isWhitelisted" BOOLEAN NOT NULL DEFAULT false,
    "factionAmount" INTEGER NOT NULL DEFAULT 1,
    "apiKeyAmount" INTEGER NOT NULL DEFAULT 1
);
INSERT INTO "new_DiscordServer" ("apiKeyAmount", "guildId", "id", "isWhitelisted") SELECT "apiKeyAmount", "guildId", "id", "isWhitelisted" FROM "DiscordServer";
DROP TABLE "DiscordServer";
ALTER TABLE "new_DiscordServer" RENAME TO "DiscordServer";
CREATE UNIQUE INDEX "DiscordServer_guildId_key" ON "DiscordServer"("guildId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
