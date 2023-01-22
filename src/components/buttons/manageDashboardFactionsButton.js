const { getDashboardButtons } = require("../functions/getDashboardButtons");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  developer: true,
  data: { name: "dashboard-manage-factions" },
  async execute(interaction, client) {
    interaction.message.delete();
    await interaction.deferReply();
    const prisma = require("../../index");
    const guildID = Number(interaction.guildId);
    let discordServerInfo;

    try {
      discordServerInfo = await prisma.discordServer.findUnique({
        where: {
          guildId: guildID,
        },
        select: {
          factions: true,
          isWhitelisted: true,
          apiKey: true,
        },
      });
    } catch (error) {
      console.log(error);
    }

    const manageFactionsButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("dashboard-add-faction")
        .setLabel("Add Faction ")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("dashboard-remove-faction")
        .setLabel("Remove Faction")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(discordServerInfo.factions.length === 0)
    );

    const embeds = new EmbedBuilder()
      .setTitle("Manage Factions")
      .setDescription(
        "This is not done yet and under development, so for now. Click away :)"
      );
    let buttons = await getDashboardButtons("factions", true, true);
    if (discordServerInfo.isWhitelisted) {
      buttons = await getDashboardButtons(
        "factions",
        !discordServerInfo.isWhitelisted,
        discordServerInfo.apiKey.length === 0
      );
    }

    //Reply to the discord client
    await interaction.followUp({
      embeds: [embeds],
      components: [buttons, manageFactionsButtons],
    });
  },
};
