import { PrismaClient } from "@prisma/client";

export async function upsertFaction(
  prisma: PrismaClient,
  id: number,
  factionName: string
) {
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
    return result;
  } catch (error) {
    console.log("Failure: upsertFaction");
  }
}
export async function getFaction(prisma: PrismaClient, id: number) {
  try {
    const result = await prisma.faction.findUnique({
      where: {
        id: id,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: getFaction");
  }
}
export async function getAllFactions(prisma: PrismaClient) {
  try {
    const result = await prisma.faction.findMany({});
    return result;
  } catch (error) {
    console.log("Failure: getAllFactions");
  }
}
