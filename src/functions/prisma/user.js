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
          connect: { tornId: factionId },
        },
      },
      create: {
        id: id,
        name: name,
        faction: {
          connect: { tornId: factionId },
        },
      },
    });
    console.log("Success: upsertUserAndConnectFaction");
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
    console.log("Success: getUser");
    return result;
  } catch (error) {
    console.log("Failure: getUser");
    console.log("error", error);
  }
}

module.exports = {
  upsertUserAndConnectFaction,
  getUser,
};
