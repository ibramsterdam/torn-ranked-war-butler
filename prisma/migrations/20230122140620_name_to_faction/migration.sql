/*
  Warnings:

  - Added the required column `name` to the `Faction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Faction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tornId" INTEGER NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Faction" ("id", "tornId") SELECT "id", "tornId" FROM "Faction";
DROP TABLE "Faction";
ALTER TABLE "new_Faction" RENAME TO "Faction";
CREATE UNIQUE INDEX "Faction_tornId_key" ON "Faction"("tornId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
