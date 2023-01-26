const { getFactionFromTornApi } = require("../../util/tornApiUtil");
const { getDashboardButtons } = require("../functions/getDashboardButtons");

const {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");
const { getDiscordServer } = require("../../functions/prisma/discord");
const { upsertFaction } = require("../../functions/prisma/faction");
const {
  upsertFactionOnDiscordServerConnection,
  getConnectedFactionsOnDiscordServer,
} = require("../../functions/prisma/factionsOnDiscordServer");
const { getFactionsEmbed } = require("../functions/factionsEmbed");

module.exports = {
  data: { name: "add-faction-modal" },
  async execute(interaction, client) {
    await interaction.deferReply();
    const factionId = interaction.fields.getTextInputValue(
      "add-faction-text-input"
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

    const result = await getFactionFromTornApi(
      factionId,
      server.apiKeys[0].value
    );
    const faction = await upsertFaction(
      prisma,
      result.data.ID,
      result.data.name
    );
    const connection = await upsertFactionOnDiscordServerConnection(
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
      server.apiKeys.length
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
        .setDisabled(server.factions.length === 0)
    );
    //Reply to the discord client
    interaction.message.delete();

    return await interaction.followUp({
      embeds: [embeds],
      components: [buttons, manageApiKeysButtons],
    });
  },
};
