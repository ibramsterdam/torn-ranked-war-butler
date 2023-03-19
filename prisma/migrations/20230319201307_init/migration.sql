-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "name" TEXT,
    "factionId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastActionRelative" TEXT,
    "lastActionStatus" TEXT,
    "lastActionTimestamp" BIGINT,
    "statusDescription" TEXT,
    "statusDetails" TEXT,
    "statusState" TEXT,
    "statusUntil" BIGINT,
    "retalliationUntil" TIMESTAMP(3),
    "attackLink" TEXT,
    "profileLink" TEXT,
    "age" INTEGER,
    "energydrinkTaken" INTEGER,
    "networth" BIGINT,
    "xanaxTaken" INTEGER,
    "energyRefills" INTEGER,
    "revivable" INTEGER,
    "defense" BIGINT,
    "dexterity" BIGINT,
    "ffBonus" DECIMAL(65,30),
    "speed" BIGINT,
    "spyReportDate" TIMESTAMP(3),
    "statTotal" BIGINT,
    "strength" BIGINT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordServer" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "isWhitelisted" BOOLEAN NOT NULL DEFAULT false,
    "factionAmount" INTEGER NOT NULL DEFAULT 1,
    "apiKeyAmount" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscordServer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "accessLevel" TEXT NOT NULL DEFAULT 'Public',
    "userId" INTEGER NOT NULL,
    "discordServerId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "brainSurgeonKey" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordCategory" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "discordServerId" BIGINT NOT NULL,

    CONSTRAINT "DiscordCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordChannel" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "discordCategoryId" BIGINT NOT NULL,
    "discordServerId" BIGINT NOT NULL,
    "factionId" INTEGER,

    CONSTRAINT "DiscordChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faction" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Faction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactionsOnDiscordServer" (
    "discordServerId" BIGINT NOT NULL,
    "factionId" INTEGER NOT NULL,
    "discordChannelId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FactionsOnDiscordServer_pkey" PRIMARY KEY ("factionId","discordServerId")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordServer_id_key" ON "DiscordServer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_value_key" ON "ApiKey"("value");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_userId_key" ON "ApiKey"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordCategory_discordServerId_key" ON "DiscordCategory"("discordServerId");

-- CreateIndex
CREATE UNIQUE INDEX "FactionsOnDiscordServer_discordChannelId_key" ON "FactionsOnDiscordServer"("discordChannelId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_discordServerId_fkey" FOREIGN KEY ("discordServerId") REFERENCES "DiscordServer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordCategory" ADD CONSTRAINT "DiscordCategory_discordServerId_fkey" FOREIGN KEY ("discordServerId") REFERENCES "DiscordServer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordChannel" ADD CONSTRAINT "DiscordChannel_discordCategoryId_fkey" FOREIGN KEY ("discordCategoryId") REFERENCES "DiscordCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordChannel" ADD CONSTRAINT "DiscordChannel_discordServerId_fkey" FOREIGN KEY ("discordServerId") REFERENCES "DiscordServer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordChannel" ADD CONSTRAINT "DiscordChannel_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactionsOnDiscordServer" ADD CONSTRAINT "FactionsOnDiscordServer_discordChannelId_fkey" FOREIGN KEY ("discordChannelId") REFERENCES "DiscordChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactionsOnDiscordServer" ADD CONSTRAINT "FactionsOnDiscordServer_discordServerId_fkey" FOREIGN KEY ("discordServerId") REFERENCES "DiscordServer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactionsOnDiscordServer" ADD CONSTRAINT "FactionsOnDiscordServer_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
