async function getUsersThatSharedTheirApiKeyOnDiscordServer(guildId, prisma) {
  try {
    const users = await prisma.apiKey.findMany({
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
    return users;
  } catch (error) {
    console.log("error", error);
  }
}

module.exports = {
  getUsersThatSharedTheirApiKeyOnDiscordServer,
};
