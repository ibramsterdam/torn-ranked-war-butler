-- CreateTable
CREATE TABLE "Faction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tornId" INTEGER NOT NULL,
    "members" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "FactionsOnDiscordServer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "discordServerId" INTEGER,
    "factionId" INTEGER,
    CONSTRAINT "FactionsOnDiscordServer_discordServerId_fkey" FOREIGN KEY ("discordServerId") REFERENCES "DiscordServer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "FactionsOnDiscordServer_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Faction_tornId_key" ON "Faction"("tornId");
