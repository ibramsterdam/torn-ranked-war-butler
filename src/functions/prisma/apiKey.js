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
    console.log("Failure: getUsersThatSharedTheirApiKeyOnDiscordServer");
    console.log("error", error);
  }
}
/**
 *  @param {PrismaClient} prisma
 *  @param {String} key
 *  @param {Number} serverId
 *  @param {Number} userId
 */
async function createApiKey(prisma, key, serverId, userId) {
  try {
    const result = await prisma.apiKey.create({
      data: {
        value: key,
        userId: userId,
        discordServerId: serverId,
      },
    });
    console.log("Success: createApiKey");
    return result;
  } catch (error) {
    console.log("Failure: createApiKey");
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
    console.log("Failure: getFirstConnectedApiKeyDiscordServer");
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
    console.log("Failure: getApiKey");
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
    console.log("Failure: deleteApiKeyOfUser");
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
    console.log("Failure: getApiKeysThatAreUsedOnDiscordServer");
    console.log("error", error);
  }
}

/**
 *  @param {PrismaClient} prisma
 *  @param {String} key
 */
async function getApiKeyByValue(prisma, key) {
  try {
    const result = await prisma.apiKey.findUnique({
      where: {
        value: key,
      },
    });
    console.log("Success: getApiKey");
    return result;
  } catch (error) {
    console.log("Failure: getApiKey");
    console.log("error", error);
  }
}

module.exports = {
  getUsersThatSharedTheirApiKeyOnDiscordServer,
  createApiKey,
  getFirstConnectedApiKeyDiscordServer,
  getApiKeyFromUser,
  deleteApiKeyOfUser,
  getApiKeysThatAreUsedOnDiscordServer,
  getApiKeyByValue,
};
