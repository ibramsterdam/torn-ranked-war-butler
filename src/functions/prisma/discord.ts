import { PrismaClient } from "@prisma/client";

export async function getDiscordServer(prisma: PrismaClient, id: bigint) {
  try {
    const result = await prisma.discordServer.findUnique({
      where: {
        id: BigInt(id),
      },
      include: {
        apiKeys: true,
        factions: true,
        discordCategory: true,
        discordChannel: true,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: getDiscordServer");
    console.log("error", error);
  }
}

export async function createDiscordServer(
  prisma: PrismaClient,
  serverId: number,
  name: string
) {
  try {
    const result = await prisma.discordServer.create({
      data: {
        id: BigInt(serverId),
        name: name,
      },
      include: {
        apiKeys: true,
        factions: true,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: getDiscordServer");
    console.log("error", error);
  }
}
