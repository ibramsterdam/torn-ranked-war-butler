async function upsertFaction(prisma, factionId, factionName) {
  try {
    const result = await prisma.faction.upsert({
      where: {
        tornId: factionId,
      },
      update: {
        name: factionName,
      },
      create: {
        tornId: factionId,
        name: factionName,
      },
    });
    console.log("Success: upsertFaction");
    return result;
  } catch (error) {
    console.log("Failure: upsertFaction");
    console.log("error", error);
  }
}
async function getFaction(prisma, tornId) {
  try {
    const result = await prisma.faction.findUnique({
      where: {
        tornId: tornId,
      },
    });
    console.log("Success: getFaction");
    return result;
  } catch (error) {
    console.log("Failure: getFaction");
    console.log("error", error);
  }
}

module.exports = {
  upsertFaction,
  getFaction,
};
