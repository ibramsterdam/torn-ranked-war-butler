/*
  Warnings:

  - You are about to drop the column `discordServerId` on the `DiscordServer` table. All the data in the column will be lost.
  - Added the required column `guildId` to the `DiscordServer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DiscordServer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guildId" BIGINT NOT NULL,
    "isWhitelisted" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_DiscordServer" ("id", "isWhitelisted") SELECT "id", "isWhitelisted" FROM "DiscordServer";
DROP TABLE "DiscordServer";
ALTER TABLE "new_DiscordServer" RENAME TO "DiscordServer";
CREATE UNIQUE INDEX "DiscordServer_guildId_key" ON "DiscordServer"("guildId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
