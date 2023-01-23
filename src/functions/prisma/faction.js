async function upsertFaction(prisma, faction) {
  try {
    const result = await prisma.faction.upsert({
      where: {
        tornId: faction.faction_id,
      },
      update: {
        name: faction.faction_name,
      },
      create: {
        tornId: faction.faction_id,
        name: faction.faction_name,
      },
    });
    console.log("Success: upsertFaction");
    return result;
  } catch (error) {
    console.log("error", error);
  }
}

module.exports = {
  upsertFaction,
};
