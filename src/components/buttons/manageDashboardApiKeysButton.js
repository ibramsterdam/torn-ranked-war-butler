const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const {
  getUsersThatSharedTheirApiKeyOnDiscordServer,
} = require("../../functions/prisma/apiKey");
const { getDiscordServer } = require("../../functions/prisma/discord");
const { getApiKeysEmbed } = require("../functions/apiKeysEmbed");
const { getDashboardButtons } = require("../functions/getDashboardButtons");

module.exports = {
  developer: false,

  data: { name: "dashboard-manage-api-keys" },
  async execute(interaction, client) {
    await interaction.deferReply();
    await interaction.message.delete();

    const guildID = BigInt(interaction.guildId);
    const prisma = require("../../index");
    const users = await getUsersThatSharedTheirApiKeyOnDiscordServer(
      prisma,
      guildID
    );
    const server = await getDiscordServer(prisma, guildID);

    const embeds = await getApiKeysEmbed(users);
    const buttons = await getDashboardButtons(
      "keys",
      !server.isWhitelisted,
      server.apiKeys.length === 0
    );

    const manageApiKeysButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("dashboard-add-api-key")
        .setLabel("Add Api Key")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(server.apiKeys.length >= server.apiKeyAmount),
      new ButtonBuilder()
        .setCustomId("dashboard-remove-api-key")
        .setLabel("Remove Api Key")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(server.apiKeys.length === 0)
    );

    //Reply to the discord client
    await interaction.followUp({
      embeds: [embeds],
      components: [buttons, manageApiKeysButtons],
    });
  },
};
