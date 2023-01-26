const { PrismaClient } = require("@prisma/client");

/**
 *  @param {PrismaClient} prisma
 *  @param {BigInt} id
 */
async function getDiscordServer(prisma, id) {
  try {
    const result = await prisma.discordServer.findUnique({
      where: {
        id: BigInt(id),
      },
      include: {
        apiKeys: true,
        factions: true,
        discordCategory: true,
        discordChannel: true,
      },
    });
    console.log("Succes: getDiscordServer");
    return result;
  } catch (error) {
    console.log("Failure: getDiscordServer");
    console.log("error", error);
  }
}

/**
 *  @param {PrismaClient} prisma
 *  @param {BigInt} serverId
 *  @param {String} name
 */
async function createDiscordServer(prisma, serverId, name) {
  try {
    const result = await prisma.discordServer.create({
      data: {
        id: BigInt(serverId),
        name: name,
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

/**
 *  @param {PrismaClient} prisma
 *  @param {BigInt} id
 */
async function upsertDiscordServer(prisma, id) {
  try {
    const result = await prisma.discordServer.upsert({
      where: {
        id: BigInt(id),
      },
      update: {},
      create: {
        id: BigInt(id),
      },
      include: {
        apiKeys: true,
        factions: true,
        discordChannel: true,
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
  createDiscordServer,
  upsertDiscordServer,
};
