import { PrismaClient } from "@prisma/client";

export async function getUsersThatSharedTheirApiKeyOnDiscordServer(
  prisma: PrismaClient,
  id: bigint
) {
  try {
    const result = await prisma.apiKey.findMany({
      where: {
        discordServer: {
          id: id,
        },
      },
      select: {
        user: {
          include: {
            faction: true,
          },
        },
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: getUsersThatSharedTheirApiKeyOnDiscordServer");
    console.log("error", error);
  }
}
export async function createApiKey(
  prisma: PrismaClient,
  key: string,
  serverId: number,
  userId: number
) {
  try {
    const result = await prisma.apiKey.create({
      data: {
        value: key,
        userId: userId,
        discordServerId: serverId,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: createApiKey");
    console.log("error", error);
  }
}
export async function getFirstConnectedApiKeyDiscordServer(
  prisma: PrismaClient,
  id: number
) {
  try {
    const result = await prisma.apiKey.findFirst({
      where: {
        discordServer: {
          id: id,
        },
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: getFirstConnectedApiKeyDiscordServer");
    console.log("error", error);
  }
}

export async function getApiKeyFromUser(prisma: PrismaClient, userId: number) {
  try {
    const result = await prisma.apiKey.findUnique({
      where: {
        userId: userId,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: getApiKey");
    console.log("error", error);
  }
}
export async function deleteApiKeyOfUser(prisma: PrismaClient, userId: number) {
  try {
    const result = await prisma.apiKey.delete({
      where: {
        userId: userId,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: deleteApiKeyOfUser");
    console.log("error", error);
  }
}
export async function getApiKeysThatAreUsedOnDiscordServer(
  prisma: PrismaClient,
  id: number
) {
  try {
    const result = await prisma.apiKey.findMany({
      where: {
        discordServer: {
          id: id,
        },
      },
      select: {
        value: true,
        user: {
          include: {
            faction: true,
          },
        },
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: getApiKeysThatAreUsedOnDiscordServer");
    console.log("error", error);
  }
}

export async function getApiKeyByValue(prisma: PrismaClient, key: string) {
  try {
    const result = await prisma.apiKey.findUnique({
      where: {
        value: key,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: getApiKeyByValue");
    console.log("error", error);
  }
}

export async function getBrainSurgeonApiKeys(prisma: PrismaClient) {
  try {
    const result = await prisma.apiKey.findMany({
      where: {
        brainSurgeonKey: true,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: getBrainSurgeonApiKeys");
    console.log("error", error);
  }
}

export async function getAllApiKeys(prisma: PrismaClient) {
  try {
    const result = await prisma.apiKey.findMany({
      select: {
        value: true,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: getAllApiKeys");
    console.log("error", error);
  }
}
