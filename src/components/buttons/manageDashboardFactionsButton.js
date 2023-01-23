const { getDashboardButtons } = require("../functions/getDashboardButtons");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { getDiscordServer } = require("../../functions/prisma/discord");

module.exports = {
  developer: true,
  data: { name: "dashboard-manage-factions" },
  async execute(interaction, client) {
    interaction.message.delete();
    await interaction.deferReply();
    const prisma = require("../../index");
    const guildID = Number(interaction.guildId);

    const server = await getDiscordServer(guildID, prisma);

    const manageFactionsButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("dashboard-add-faction")
        .setLabel("Add Faction ")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("dashboard-remove-faction")
        .setLabel("Remove Faction")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(server.factions.length === 0)
    );

    const embeds = new EmbedBuilder()
      .setTitle("Manage Factions")
      .setDescription(
        "This is not done yet and under development, so for now. Click away :)"
      );
    let buttons = await getDashboardButtons("factions", true, true);
    if (server.isWhitelisted) {
      buttons = await getDashboardButtons(
        "factions",
        !server.isWhitelisted,
        server.apiKey.length === 0
      );
    }

    //Reply to the discord client
    await interaction.followUp({
      embeds: [embeds],
      components: [buttons, manageFactionsButtons],
    });
  },
};
