const { PrismaClient } = require("@prisma/client");

/**
 *  @param {PrismaClient} prisma
 *  @param {BigInt} categoryId
 *  @param {String} categoryName
 */
async function createDiscordCategory(
  prisma,
  categoryId,
  categoryName,
  serverId
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

module.exports = {
  createDiscordCategory,
};
