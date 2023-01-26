const { getDashboardButtons } = require("../functions/getDashboardButtons");
const { getUser } = require("../../functions/prisma/user");

const {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");
const {
  getApiKeyFromUser,
  deleteApiKeyOfUser,
  getApiKeysThatAreUsedOnDiscordServer,
} = require("../../functions/prisma/apiKey");
const { getDiscordServer } = require("../../functions/prisma/discord");
const { getApiKeysEmbed } = require("../functions/apiKeysEmbed");

module.exports = {
  data: { name: "remove-api-key-modal" },
  async execute(interaction, client) {
    await interaction.deferReply();
    const tornIdOfUser = interaction.fields.getTextInputValue(
      "remove-api-key-text-input"
    );

    // validate if apikey returns a user
    if (!/^\d+$/.test(tornIdOfUser)) {
      return await interaction.editReply("Torn Id is composed of numbers...");
    }

    const guildID = BigInt(interaction.guildId);
    const prisma = require("../../index");
    const user = await getUser(prisma, Number(tornIdOfUser));

    if (!user) {
      return await interaction.editReply("Can't find this user");
    }
    const keys = await getApiKeysThatAreUsedOnDiscordServer(prisma, guildID);
    const userKey = await getApiKeyFromUser(prisma, user.id);

    // validate if the key exists on this server
    if (!keys.find((key) => key?.value === userKey?.value)) {
      return await interaction.editReply(
        "The key of the user you are trying to remove does exist"
      );
    }

    const apiKey = await deleteApiKeyOfUser(prisma, user.id);
    const users = await getApiKeysThatAreUsedOnDiscordServer(prisma, guildID);
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
        .setLabel("Set Api Key")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(server.apiKeys.length >= server.apiKeyAmount),
      new ButtonBuilder()
        .setCustomId("dashboard-remove-api-key")
        .setLabel("Remove Api Key")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(server.apiKeys.length === 0)
    );

    //Reply to the discord client
    interaction.message.delete();

    return await interaction.followUp({
      embeds: [embeds],
      components: [buttons, manageApiKeysButtons],
    });
  },
};
