async function upsertUserAndConnectFaction(user, prisma) {
  try {
    const result = await prisma.user.upsert({
      where: {
        tornId: user.player_id,
      },
      update: {
        name: user.name,
        faction: {
          connect: { tornId: user.faction.faction_id },
        },
      },
      create: {
        tornId: user.player_id,
        name: user.name,
        faction: {
          connect: { tornId: user.faction.faction_id },
        },
      },
    });
    console.log("Success: upsertUserAndConnectFaction");
    return result;
  } catch (error) {
    console.log("error", error);
  }
}

module.exports = {
  upsertUserAndConnectFaction,
};
