/**
 *  @param {PrismaClient} prisma
 *  @param {Number} id
 */
async function getUsersThatSharedTheirApiKeyOnDiscordServer(prisma, id) {
  try {
    const result = await prisma.apiKey.findMany({
      where: {
        discordServer: {
          id: id,
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
    return result;
  } catch (error) {
    console.log("Failure: createApiKey");
    console.log("error", error);
  }
}
/**
 *  @param {PrismaClient} prisma
 *  @param {Number} id
 */
async function getFirstConnectedApiKeyDiscordServer(prisma, id) {
  try {
    const result = await prisma.apiKey.findFirst({
      where: {
        discordServer: {
          id: id,
        },
      },
    });
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
    return result;
  } catch (error) {
    console.log("Failure: deleteApiKeyOfUser");
    console.log("error", error);
  }
}
/**
 *  @param {PrismaClient} prisma
 *  @param {Number} id
 */
async function getApiKeysThatAreUsedOnDiscordServer(prisma, id) {
  try {
    const result = await prisma.apiKey.findMany({
      where: {
        discordServer: {
          id: id,
        },
      },
      select: {
        value: true,
        user: {
          include: {
            faction: true,
          },
        },
      },
    });
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
    return result;
  } catch (error) {
    console.log("Failure: getApiKeyByValue");
    console.log("error", error);
  }
}
/**
 *  @param {PrismaClient} prisma
 */
async function getAllApiKeys(prisma) {
  try {
    const result = await prisma.apiKey.findMany({
      select: {
        value: true,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: getAllApiKeys");
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
  getAllApiKeys,
};
