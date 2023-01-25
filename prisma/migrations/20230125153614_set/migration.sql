/*
  Warnings:

  - The primary key for the `FactionsOnDiscordServer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `FactionsOnDiscordServer` table. All the data in the column will be lost.
  - Made the column `discordServerId` on table `FactionsOnDiscordServer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `factionId` on table `FactionsOnDiscordServer` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FactionsOnDiscordServer" (
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "discordServerId" INTEGER NOT NULL,
    "factionId" INTEGER NOT NULL,

    PRIMARY KEY ("factionId", "discordServerId"),
    CONSTRAINT "FactionsOnDiscordServer_discordServerId_fkey" FOREIGN KEY ("discordServerId") REFERENCES "DiscordServer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FactionsOnDiscordServer_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FactionsOnDiscordServer" ("createdAt", "discordServerId", "factionId", "updatedAt") SELECT "createdAt", "discordServerId", "factionId", "updatedAt" FROM "FactionsOnDiscordServer";
DROP TABLE "FactionsOnDiscordServer";
ALTER TABLE "new_FactionsOnDiscordServer" RENAME TO "FactionsOnDiscordServer";
CREATE TABLE "new_DiscordServer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guildId" BIGINT NOT NULL,
    "isWhitelisted" BOOLEAN NOT NULL DEFAULT false,
    "factionsAmount" INTEGER NOT NULL DEFAULT 1,
    "apiKeyAmount" INTEGER NOT NULL DEFAULT 1
);
INSERT INTO "new_DiscordServer" ("guildId", "id", "isWhitelisted") SELECT "guildId", "id", "isWhitelisted" FROM "DiscordServer";
DROP TABLE "DiscordServer";
ALTER TABLE "new_DiscordServer" RENAME TO "DiscordServer";
CREATE UNIQUE INDEX "DiscordServer_guildId_key" ON "DiscordServer"("guildId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
