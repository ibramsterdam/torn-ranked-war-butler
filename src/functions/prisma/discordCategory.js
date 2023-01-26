const { PrismaClient } = require("@prisma/client");

/**
 *  @param {PrismaClient} prisma
 *  @param {Number} categoryId
 *  @param {String} categoryName
 */
async function createDiscordCategory(
  prisma,
  categoryId,
  categoryName,
  serverId
) {
  console.log("OI", categoryId);
  try {
    const result = await prisma.discordCategory.create({
      data: {
        id: categoryId,
        name: categoryName,
        discordServerId: serverId,
      },
    });
    console.log(typeof result.id);
    console.log("Succes: createDiscordCategory");
    return result;
  } catch (error) {
    console.log("Failure: createDiscordCategory");
    console.log("error", error);
  }
}

module.exports = {
  createDiscordCategory,
};
