const { getUser } = require("../../util/tornApiUtil");

module.exports = {
  data: { name: "set-api-key-modal" },
  async execute(interaction, client) {
    await interaction.deferReply();
    const apiKey = interaction.fields.getTextInputValue(
      "set-api-key-text-input"
    );
    const KEY_LENGTH = 16;

    //validate input
    if (apiKey.length !== KEY_LENGTH) {
      return await interaction.editReply("Not a valid key");
    }

    const user = await getUser(apiKey);

    if (user.data.error) {
      return await interaction.editReply("Not a valid key");
    }

    const guildID = Number(client.application.id);
    console.log("guildID", guildID);
    const prisma = require("../../index");

    try {
      const dbDiscordServer = await prisma.discordServer.upsert({
        where: {
          discordServerId: guildID,
        },
        update: {
          discordServerId: guildID,
        },
        create: {
          discordServerId: guildID,
        },
      });
      const dbUser = await prisma.user.upsert({
        where: {
          tornId: user.data.player_id,
        },
        update: {},
        create: {
          tornId: user.data.player_id,
        },
      });
      const dbApiKey = await prisma.apiKey.upsert({
        where: {
          value: apiKey,
        },
        update: {},
        create: {
          value: apiKey,
          discordServerId: dbDiscordServer.id,
          userId: dbUser.id,
        },
      });

      const countKeysForGuild = await prisma.apiKey.count({
        where: {
          discordServerId: dbDiscordServer.id,
        },
      });

      return await interaction.editReply({
        content: `Amount of keys connected: ${countKeysForGuild}`,
      });
    } catch (error) {
      console.log("Err while working with prisma", error);
    }

    await interaction.editReply({
      content: `something went wrong`,
    });
  },
};
