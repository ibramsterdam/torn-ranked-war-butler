const { PrismaClient } = require("@prisma/client");

/**
 *  @param {PrismaClient} prisma
 *  @param {BigInt} channelId
 *  @param {String} channelName
 *  @param {BigInt} categoryId
 *  @param {BigInt} serverId
 */
async function createDiscordChannel(
  prisma,
  channelId,
  channelName,
  categoryId,
  serverId
) {
  try {
    const result = await prisma.discordChannel.create({
      data: {
        id: BigInt(channelId),
        name: channelName,
        discordCategoryId: BigInt(categoryId),
        discordServerId: BigInt(serverId),
      },
    });

    return result;
  } catch (error) {
    console.log("Failure: createDiscordChannel");
    console.log("error", error);
  }
}

module.exports = {
  createDiscordChannel,
};
