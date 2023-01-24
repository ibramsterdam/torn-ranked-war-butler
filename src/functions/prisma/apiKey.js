async function getUsersThatSharedTheirApiKeyOnDiscordServer(prisma, guildId) {
  try {
    const result = await prisma.apiKey.findMany({
      where: {
        discordServer: {
          guildId: guildId,
        },
      },
      select: {
        user: {
          include: {
            faction: true,
          },
        },
      },
    });
    console.log("Success: getUsersThatSharedTheirApiKeyOnDiscordServer");
    return result;
  } catch (error) {
    console.log("error", error);
  }
}
async function upsertApiKey(prisma, key, serverId, userId) {
  try {
    const result = await prisma.apiKey.upsert({
      where: {
        value: key,
      },
      update: {
        value: key,
        discordServerId: serverId,
        userId: userId,
      },
      create: {
        value: key,
        discordServerId: serverId,
        userId: userId,
      },
    });
    console.log("Success: upsertApiKey");
    return result;
  } catch (error) {
    console.log("error", error);
  }
}
async function getFirstConnectedApiKeyDiscordServer(prisma, guildId) {
  try {
    const result = await prisma.apiKey.findFirst({
      where: {
        discordServer: {
          guildId: guildId,
        },
      },
    });
    console.log("Success: getFirstConnectedApiKeyDiscordServer");
    return result;
  } catch (error) {
    console.log("error", error);
  }
}

module.exports = {
  getUsersThatSharedTheirApiKeyOnDiscordServer,
  upsertApiKey,
  getFirstConnectedApiKeyDiscordServer,
};
