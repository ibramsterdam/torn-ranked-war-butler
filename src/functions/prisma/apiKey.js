/**
 *  @param {PrismaClient} prisma
 *  @param {Number} guildId
 */
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
/**
 *  @param {PrismaClient} prisma
 *  @param {String} key
 *  @param {Number} serverId
 *  @param {Number} userId
 */
async function upsertApiKey(prisma, key, serverId, userId) {
  try {
    const result = await prisma.apiKey.upsert({
      where: {
        value: key,
      },
      update: {
        value: key,
        discordServerId: serverId,
        userId: userId,
      },
      create: {
        value: key,
        discordServerId: serverId,
        userId: userId,
      },
    });
    console.log("Success: upsertApiKey");
    return result;
  } catch (error) {
    console.log("error", error);
  }
}
/**
 *  @param {PrismaClient} prisma
 *  @param {Number} guildId
 */
async function getFirstConnectedApiKeyDiscordServer(prisma, guildId) {
  try {
    const result = await prisma.apiKey.findFirst({
      where: {
        discordServer: {
          guildId: guildId,
        },
      },
    });
    console.log("Success: getFirstConnectedApiKeyDiscordServer");
    return result;
  } catch (error) {
    console.log("error", error);
  }
}
const { PrismaClient } = require("@prisma/client");

/**
 *  @param {PrismaClient} prisma
 *  @param {String} userId
 */
async function getApiKeyFromUser(prisma, userId) {
  try {
    const result = await prisma.apiKey.findUnique({
      where: {
        userId: userId,
      },
    });
    console.log("Success: getApiKey");
    return result;
  } catch (error) {
    console.log("error", error);
  }
}
/**
 *  @param {PrismaClient} prisma
 *  @param {Number} userId
 */
async function deleteApiKeyOfUser(prisma, userId) {
  try {
    const result = await prisma.apiKey.delete({
      where: {
        userId: userId,
      },
    });
    console.log("Success: deleteApiKeyOfUser");
    return result;
  } catch (error) {
    console.log("error", error);
  }
}
/**
 *  @param {PrismaClient} prisma
 *  @param {Number} guildId
 */
async function getApiKeysThatAreUsedOnDiscordServer(prisma, guildId) {
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
    console.log("Success: getApiKeysThatAreUsedOnDiscordServer");
    return result;
  } catch (error) {
    console.log("error", error);
  }
}

module.exports = {
  getUsersThatSharedTheirApiKeyOnDiscordServer,
  upsertApiKey,
  getFirstConnectedApiKeyDiscordServer,
  getApiKeyFromUser,
  deleteApiKeyOfUser,
  getApiKeysThatAreUsedOnDiscordServer,
};
