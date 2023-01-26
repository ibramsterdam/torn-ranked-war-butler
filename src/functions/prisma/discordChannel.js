const { PrismaClient } = require("@prisma/client");

/**
 *  @param {PrismaClient} prisma
 *  @param {BigInt} channelId
 *  @param {String} channelName
 *  @param {BigInt} categoryId
 *  @param {BigInt} serverId
 *  @param {BigInt | null} factionId
 */
async function createDiscordChannel(
  prisma,
  channelId,
  channelName,
  categoryId,
  serverId,
  factionId
) {
  try {
    const result = await prisma.discordChannel.create({
      data: {
        id: BigInt(channelId),
        name: channelName,
        discordCategoryId: BigInt(categoryId),
        discordServerId: BigInt(serverId),
        factionId: factionId,
      },
    });

    console.log("Succes: createDiscordChannel");
    return result;
  } catch (error) {
    console.log("Failure: createDiscordChannel");
    console.log("error", error);
  }
}

module.exports = {
  createDiscordChannel,
};
