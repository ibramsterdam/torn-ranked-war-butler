const prisma = require("../../index");

async function getDiscordServer(guildId) {
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
    console.log(discordServer);
    return discordServer;
  } catch (error) {
    console.log("error", error);
  }
}

async function upsertDiscordServer(guildId) {
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
    console.log(discordServer);
    return discordServer;
  } catch (error) {
    console.log("error", error);
  }
}

module.exports = {
  getDiscordServer,
  upsertDiscordServer,
};
