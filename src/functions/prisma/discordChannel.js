const { PrismaClient } = require("@prisma/client");

/**
 *  @param {PrismaClient} prisma
 *  @param {Number} channelId
 *  @param {String} channelName
 *  @param {String} categoryId
 *  @param {Number} serverId
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
        id: channelId,
        name: channelName,
        discordCategoryId: categoryId,
        discordServerId: serverId,
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
