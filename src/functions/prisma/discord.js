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

module.exports = {
  getDiscordServer,
};
