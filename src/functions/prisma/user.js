const { PrismaClient } = require("@prisma/client");

/**
 *  @param {PrismaClient} prisma
 *  @param {Number} id
 *  @param {String} name
 *  @param {Number} factionId
 */
async function upsertUserAndConnectFaction(prisma, id, name, factionId) {
  try {
    const result = await prisma.user.upsert({
      where: {
        id: id,
      },
      update: {
        name: name,
        faction: {
          connect: { id: factionId },
        },
      },
      create: {
        id: id,
        name: name,
        faction: {
          connect: { id: factionId },
        },
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: upsertUserAndConnectFaction");
    console.log("error", error);
  }
}
async function getUser(prisma, id) {
  try {
    const result = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        apiKey: true,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: getUser");
    console.log("error", error);
  }
}

/**
 *  @param {PrismaClient} prisma
 *  @param {BigInt} id
 *  @param {Object} userData
 *  @param {Number} factionId
 */
async function upsertUser(prisma, id, userData, factionId) {
  try {
    const result = await prisma.user.upsert({
      where: {
        id: id,
      },
      update: {
        factionId: factionId,
        name: userData.name,
        lastActionRelative: userData.last_action.relative,
        lastActionStatus: userData.last_action.status,
        lastActionTimestamp: BigInt(userData.last_action.timestamp),
        statusDescription: userData.status.description,
        statusDetails: userData.status.details,
        statusState: userData.status.state,
        statusUntil: BigInt(userData.status.until),
      },
      create: {
        id: id,
        factionId: factionId,
        name: userData.name,
        lastActionRelative: userData.last_action.relative,
        lastActionStatus: userData.last_action.status,
        lastActionTimestamp: BigInt(userData.last_action.timestamp),
        statusDescription: userData.status.description,
        statusDetails: userData.status.details,
        statusState: userData.status.state,
        statusUntil: BigInt(userData.status.until),
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: upsertUser");
    console.log("error", error);
  }
}
/**
 *  @param {PrismaClient} prisma
 *  @param {Number} factionId
 */
async function getUsersByFactionId(prisma, factionId) {
  try {
    const result = await prisma.user.findMany({
      where: {
        factionId: factionId,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: getUsersByFactionId");
    console.log("error", error);
  }
}
module.exports = {
  upsertUserAndConnectFaction,
  getUser,
  upsertUser,
  getUsersByFactionId,
};
