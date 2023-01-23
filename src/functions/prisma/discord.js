async function getDiscordServer(guildId, prisma) {
  try {
    const discordServer = await prisma.discordServer.findUnique({
      where: {
        guildId: guildId,
      },
      include: {
        apiKey: true,
        factions: true,
      },
    });
    console.log("Succes: getDiscordServer");
    return discordServer;
  } catch (error) {
    console.log("error", error);
  }
}

async function upsertDiscordServer(guildId, prisma) {
  try {
    const discordServer = await prisma.discordServer.upsert({
      where: {
        guildId: guildId,
      },
      update: {},
      create: {
        guildId: guildId,
      },
      include: {
        apiKey: true,
        factions: true,
      },
    });
    console.log("Succes: upsertDiscordServer");
    return discordServer;
  } catch (error) {
    console.log("error", error);
  }
}

module.exports = {
  getDiscordServer,
  upsertDiscordServer,
};
