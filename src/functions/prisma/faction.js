async function upsertFaction(prisma, id, factionName) {
  try {
    const result = await prisma.faction.upsert({
      where: {
        id: id,
      },
      update: {
        name: factionName,
      },
      create: {
        id: id,
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
async function getFaction(prisma, id) {
  try {
    const result = await prisma.faction.findUnique({
      where: {
        id: id,
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
