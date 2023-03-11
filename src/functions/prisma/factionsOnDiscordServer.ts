const { PrismaClient } = require("@prisma/client");

/**
 *  @param {PrismaClient} prisma
 *  @param {BigInt} serverId
 *  @param {number} factionId
 *  @param {BigInt} discordChannelId
 */
async function createFactionOnDiscordServerConnection(
  prisma,
  serverId,
  factionId,
  discordChannelId
) {
  try {
    const result = await prisma.factionsOnDiscordServer.create({
      data: {
        discordServerId: BigInt(serverId),
        discordChannelId: BigInt(discordChannelId),
        factionId: factionId,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: createFactionOnDiscordServerConnection");
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

    return result;
  } catch (error) {
    console.log("Failure: getConnectedFactionsOnDiscordServer");
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

    return result;
  } catch (error) {
    console.log("Failure: getConnectionBetweenFactionAndDiscordServer");
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

    return result;
  } catch (error) {
    console.log("Failure: deleteConnectionBetweenFactionAndDiscordServer");
    console.log("error", error);
  }
}

/**
 *  @param {PrismaClient} prisma
 *  @param {BigInt} discordServerId
 *  @param {number} factionId
 */
async function getDiscordChannelFromFactionAndDiscordServer(
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

    return result;
  } catch (error) {
    console.log("Failure: getDiscordChannelFromFactionAndDiscordServer");
    console.log("error", error);
  }
}

module.exports = {
  createFactionOnDiscordServerConnection,
  getConnectedFactionsOnDiscordServer,
  getConnectionBetweenFactionAndDiscordServer,
  deleteConnectionBetweenFactionAndDiscordServer,
  getDiscordChannelFromFactionAndDiscordServer,
};
