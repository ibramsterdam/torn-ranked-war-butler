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
async function upsertApiKey(prisma, key, server, user) {
  try {
    const result = await prisma.apiKey.upsert({
      where: {
        value: key,
      },
      update: {
        value: key,
        discordServerId: server.id,
        userId: user.id,
      },
      create: {
        value: key,
        discordServerId: server.id,
        userId: user.id,
      },
    });
    console.log("Success: upsertApiKey");
    return result;
  } catch (error) {
    console.log("error", error);
  }
}

module.exports = {
  getUsersThatSharedTheirApiKeyOnDiscordServer,
  upsertApiKey,
};
