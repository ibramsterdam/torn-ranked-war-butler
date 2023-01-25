-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "factionId" INTEGER,
    CONSTRAINT "User_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DiscordServer" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "isWhitelisted" BOOLEAN NOT NULL DEFAULT false,
    "factionAmount" INTEGER NOT NULL DEFAULT 1,
    "apiKeyAmount" INTEGER NOT NULL DEFAULT 1
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "accessLevel" TEXT NOT NULL DEFAULT 'Public',
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "discordServerId" BIGINT NOT NULL,
    CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ApiKey_discordServerId_fkey" FOREIGN KEY ("discordServerId") REFERENCES "DiscordServer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DiscordCategory" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DiscordChannel" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "discordCategoryId" BIGINT NOT NULL,
    CONSTRAINT "DiscordChannel_discordCategoryId_fkey" FOREIGN KEY ("discordCategoryId") REFERENCES "DiscordCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Faction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tornId" INTEGER NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FactionsOnDiscordServer" (
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "discordServerId" BIGINT NOT NULL,
    "factionId" INTEGER NOT NULL,

    PRIMARY KEY ("factionId", "discordServerId"),
    CONSTRAINT "FactionsOnDiscordServer_discordServerId_fkey" FOREIGN KEY ("discordServerId") REFERENCES "DiscordServer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FactionsOnDiscordServer_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordServer_id_key" ON "DiscordServer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_value_key" ON "ApiKey"("value");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_userId_key" ON "ApiKey"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Faction_tornId_key" ON "Faction"("tornId");
