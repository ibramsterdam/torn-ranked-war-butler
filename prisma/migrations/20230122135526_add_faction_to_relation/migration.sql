/*
  Warnings:

  - You are about to drop the column `members` on the `Faction` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Faction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tornId" INTEGER NOT NULL
);
INSERT INTO "new_Faction" ("id", "tornId") SELECT "id", "tornId" FROM "Faction";
DROP TABLE "Faction";
ALTER TABLE "new_Faction" RENAME TO "Faction";
CREATE UNIQUE INDEX "Faction_tornId_key" ON "Faction"("tornId");
CREATE TABLE "new_ApiKey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "accessLevel" TEXT NOT NULL DEFAULT 'Public',
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "discordServerId" INTEGER NOT NULL,
    CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ApiKey_discordServerId_fkey" FOREIGN KEY ("discordServerId") REFERENCES "DiscordServer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ApiKey" ("accessLevel", "createdAt", "discordServerId", "id", "updatedAt", "userId", "value") SELECT "accessLevel", "createdAt", "discordServerId", "id", "updatedAt", "userId", "value" FROM "ApiKey";
DROP TABLE "ApiKey";
ALTER TABLE "new_ApiKey" RENAME TO "ApiKey";
CREATE UNIQUE INDEX "ApiKey_value_key" ON "ApiKey"("value");
CREATE UNIQUE INDEX "ApiKey_userId_key" ON "ApiKey"("userId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tornId" INTEGER NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "factionId" INTEGER,
    CONSTRAINT "User_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "id", "name", "tornId", "updatedAt") SELECT "createdAt", "id", "name", "tornId", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_tornId_key" ON "User"("tornId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
