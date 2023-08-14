import { PrismaClient } from "@prisma/client";

export async function createFactionOnDiscordServerConnection(
  prisma: PrismaClient,
  serverId: number,
  factionId: number,
  discordChannelId: bigint
) {
  try {
    const result = await prisma.factionsOnDiscordServer.create({
      data: {
        discordServerId: BigInt(serverId),
        discordChannelId: discordChannelId,
        factionId: factionId,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: createFactionOnDiscordServerConnection");
  }
}

export async function getConnectedFactionsOnDiscordServer(
  prisma: PrismaClient,
  discordServerId: bigint
) {
  try {
    const result = await prisma.factionsOnDiscordServer.findMany({
      where: {
        discordServerId: discordServerId,
      },
      select: {
        faction: true,
        discordChannelId: true,
        discordServerId: true,
      },
    });

    return result;
  } catch (error) {
    console.log("Failure: getConnectedFactionsOnDiscordServer");
  }
}
export async function getConnectionBetweenFactionAndDiscordServer(
  prisma: PrismaClient,
  discordServerId: bigint,
  factionId: number
) {
  try {
    const result = await prisma.factionsOnDiscordServer.findUnique({
      where: {
        factionId_discordServerId: {
          discordServerId: discordServerId,
          factionId: factionId,
        },
      },
    });

    return result;
  } catch (error) {
    console.log("Failure: getConnectionBetweenFactionAndDiscordServer");
  }
}
export async function deleteConnectionBetweenFactionAndDiscordServer(
  prisma: PrismaClient,
  discordServerId: bigint,
  factionId: number
) {
  try {
    const result = await prisma.factionsOnDiscordServer.delete({
      where: {
        factionId_discordServerId: {
          discordServerId: discordServerId,
          factionId: factionId,
        },
      },
    });

    return result;
  } catch (error) {
    console.log("Failure: deleteConnectionBetweenFactionAndDiscordServer");
  }
}

export async function getDiscordChannelFromFactionAndDiscordServer(
  prisma: PrismaClient,
  discordServerId: bigint,
  factionId: number
) {
  try {
    const result = await prisma.factionsOnDiscordServer.findUnique({
      where: {
        factionId_discordServerId: {
          discordServerId: discordServerId,
          factionId: factionId,
        },
      },
    });

    return result;
  } catch (error) {
    console.log("Failure: getDiscordChannelFromFactionAndDiscordServer");
  }
}
