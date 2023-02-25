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
/**
 *  @param {PrismaClient} prisma
 *  @param {Number} userId
 */
async function updateUserRetalliationTimer(prisma, userId) {
  const date = new Date();
  const fourMinutesLater = new Date(date.getTime() + 60000 * 4);

  try {
    const result = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        retalliationUntil: fourMinutesLater,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: updateUserRetalliationTimer");
    console.log("error", error);
  }
}
/**
 *  @param {PrismaClient} prisma
 *  @param {Number} factionId

 */
async function getUsersThatCanBeRetalliatedFromFaction(prisma, factionId) {
  try {
    const result = await prisma.user.findMany({
      where: {
        factionId: factionId,
        retalliationUntil: {
          gt: new Date(),
        },
        statusDetails: {
          contains: "<a href",
        },
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: getUsersThatCanBeRetalliatedFromFaction");
    console.log("error", error);
  }
}
/**
 *  @param {PrismaClient} prisma
 *  @param {number} factionId
 */
async function removeUserRelationWithFaction(prisma, factionId) {
  try {
    const result = await prisma.user.updateMany({
      where: {
        factionId: factionId,
      },
      data: {
        factionId: 0,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: removeUserRelationWithFaction");
    console.log("error", error);
  }
}
module.exports = {
  upsertUserAndConnectFaction,
  getUser,
  upsertUser,
  getUsersByFactionId,
  updateUserRetalliationTimer,
  getUsersThatCanBeRetalliatedFromFaction,
  removeUserRelationWithFaction,
};
