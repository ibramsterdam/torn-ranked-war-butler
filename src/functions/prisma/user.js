async function upsertUserAndConnectFaction(prisma, tornId, name, factionId) {
  try {
    const result = await prisma.user.upsert({
      where: {
        tornId: tornId,
      },
      update: {
        name: name,
        faction: {
          connect: { tornId: factionId },
        },
      },
      create: {
        tornId: tornId,
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
async function getUser(prisma, tornId) {
  try {
    const result = await prisma.user.findUnique({
      where: {
        tornId: tornId,
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
