async function upsertFactionOnDiscordServerConnection(
  prisma,
  serverId,
  factionId
) {
  try {
    const result = await prisma.factionsOnDiscordServer.upsert({
      where: {
        factionId_discordServerId: {
          discordServerId: serverId,
          factionId: factionId,
        },
      },
      update: {},
      create: {
        discordServerId: serverId,
        factionId: factionId,
      },
    });
    console.log("Succes: upsertFactionOnDiscordServerConnection");
    return result;
  } catch (error) {
    console.log("error", error);
  }
}
async function getConnectedFactionsOnDiscordServer(prisma, discordServerId) {
  try {
    const result = await prisma.factionsOnDiscordServer.findMany({
      where: {
        discordServerId: discordServerId,
      },
      select: {
        faction: true,
      },
    });

    console.log("Succes: getConnectedFactionsOnDiscordServer");
    return result;
  } catch (error) {
    console.log("error", error);
  }
}
async function getConnectionBetweenFactionAndDiscordServer(
  prisma,
  discordServerId,
  factionId
) {
  try {
    const result = await prisma.factionsOnDiscordServer.findUnique({
      where: {
        factionId_discordServerId: {
          discordServerId: discordServerId,
          factionId: factionId,
        },
      },
    });

    console.log("Succes: getConnectionBetweenFactionAndDiscordServer");
    return result;
  } catch (error) {
    console.log("error", error);
  }
}
async function deleteConnectionBetweenFactionAndDiscordServer(
  prisma,
  discordServerId,
  factionId
) {
  try {
    const result = await prisma.factionsOnDiscordServer.delete({
      where: {
        factionId_discordServerId: {
          discordServerId: discordServerId,
          factionId: factionId,
        },
      },
    });

    console.log("Succes: deleteConnectionOfFactionAndDiscordServer");
    return result;
  } catch (error) {
    console.log("error", error);
  }
}

module.exports = {
  upsertFactionOnDiscordServerConnection,
  getConnectedFactionsOnDiscordServer,
  getConnectionBetweenFactionAndDiscordServer,
  deleteConnectionBetweenFactionAndDiscordServer,
};
