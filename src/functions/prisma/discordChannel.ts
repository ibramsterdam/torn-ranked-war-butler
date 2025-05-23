import { PrismaClient } from "@prisma/client";

export async function createDiscordChannel(
  prisma: PrismaClient,
  channelId: bigint,
  channelName: string,
  categoryId: number,
  serverId: number
) {
  try {
    const result = await prisma.discordChannel.create({
      data: {
        id: channelId,
        name: channelName,
        discordCategoryId: BigInt(categoryId),
        discordServerId: BigInt(serverId),
      },
    });

    return result;
  } catch (error) {
    console.log("Failure: createDiscordChannel");
  }
}
export async function deleteChannel(prisma: PrismaClient, channelId: bigint) {
  try {
    const result = await prisma.discordChannel.delete({
      where: {
        id: channelId,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: deleteChannel");
  }
}
