async function getDiscordServer(prisma, id) {
  try {
    const result = await prisma.discordServer.findUnique({
      where: {
        id: id,
      },
      include: {
        apiKeys: true,
        factions: true,
      },
    });
    console.log("Succes: getDiscordServer");
    return result;
  } catch (error) {
    console.log("Failure: getDiscordServer");
    console.log("error", error);
  }
}

async function upsertDiscordServer(prisma, id) {
  try {
    const result = await prisma.discordServer.upsert({
      where: {
        id: id,
      },
      update: {},
      create: {
        id: id,
      },
      include: {
        apiKeys: true,
        factions: true,
      },
    });
    console.log("Succes: upsertDiscordServer");
    return result;
  } catch (error) {
    console.log("Failure: upsertDiscordServer");
    console.log("error", error);
  }
}

module.exports = {
  getDiscordServer,
  upsertDiscordServer,
};
