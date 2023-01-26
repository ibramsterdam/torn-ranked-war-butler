const { getDashboardButtons } = require("../functions/getDashboardButtons");

const {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");
const { getDiscordServer } = require("../../functions/prisma/discord");
const { getFaction } = require("../../functions/prisma/faction");
const {
  getConnectedFactionsOnDiscordServer,
  getConnectionBetweenFactionAndDiscordServer,
  deleteConnectionBetweenFactionAndDiscordServer,
} = require("../../functions/prisma/factionsOnDiscordServer");
const { getFactionsEmbed } = require("../functions/factionsEmbed");

module.exports = {
  data: { name: "remove-faction-modal" },
  async execute(interaction, client) {
    await interaction.deferReply();
    const factionId = interaction.fields.getTextInputValue(
      "remove-faction-text-input"
    );

    // validate if apikey returns a user
    if (!/^\d+$/.test(factionId)) {
      return await interaction.editReply(
        "Faction id is composed of numbers..."
      );
    }

    const guildID = BigInt(interaction.guildId);
    const prisma = require("../../index");
    let server = await getDiscordServer(prisma, guildID);
    const faction = await getFaction(prisma, Number(factionId));
    const connection = await getConnectionBetweenFactionAndDiscordServer(
      prisma,
      server.id,
      faction.id
    );

    if (!connection) {
      return await interaction.editReply("Faction is not connected");
    }

    const deletedConnection =
      await deleteConnectionBetweenFactionAndDiscordServer(
        prisma,
        server.id,
        faction.id
      );
    const connectedFactions = await getConnectedFactionsOnDiscordServer(
      prisma,
      server.id
    );
    const factions = await getConnectedFactionsOnDiscordServer(
      prisma,
      server.id
    );
    server = await getDiscordServer(prisma, guildID);

    // create ui
    const embeds = await getFactionsEmbed(factions);
    const buttons = await getDashboardButtons(
      "factions",
      !server.isWhitelisted,
      server.apiKeys.length === 0
    );
    const manageApiKeysButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("dashboard-add-faction")
        .setLabel("Add Faction")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(server.factions.length >= server.factionAmount),
      new ButtonBuilder()
        .setCustomId("dashboard-remove-faction")
        .setLabel("Remove Faction")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(connectedFactions.length === 0)
    );

    //Reply to the discord client
    interaction.message.delete();

    return await interaction.followUp({
      embeds: [embeds],
      components: [buttons, manageApiKeysButtons],
    });
  },
};
