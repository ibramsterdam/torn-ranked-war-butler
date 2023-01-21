/*
  Warnings:

  - You are about to alter the column `discordId` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tornId" INTEGER NOT NULL,
    "discordId" BIGINT NOT NULL,
    "isWhitelisted" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "discordId", "id", "isWhitelisted", "tornId", "updatedAt") SELECT "createdAt", "discordId", "id", "isWhitelisted", "tornId", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_tornId_key" ON "User"("tornId");
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
