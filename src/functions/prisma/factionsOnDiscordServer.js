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

module.exports = {
  upsertFactionOnDiscordServerConnection,
  getConnectedFactionsOnDiscordServer,
};
