import { PrismaClient } from "@prisma/client";

export async function createDiscordCategory(
  prisma: PrismaClient,
  categoryId: number,
  categoryName: string,
  serverId: number
) {
  try {
    const result = await prisma.discordCategory.create({
      data: {
        id: BigInt(categoryId),
        name: categoryName,
        discordServerId: serverId,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: createDiscordCategory");
    console.log("error", error);
  }
}
