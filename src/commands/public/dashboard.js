const {
  EmbedBuilder,
  SlashCommandBuilder,
  CommandInteraction,
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const { dashboardEmbed } = require("../../components/embeds/dashboardEmbed");
const { dashboardButtons } = require("../../functions/dashboardButtons");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("dashboard")
    .setDescription("Manage your Butler"),
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();

    const embeds = await dashboardEmbed();
    const buttons = await dashboardButtons();

    //Reply to the discord client
    await interaction.followUp({
      embeds: [embeds],
      components: buttons,
    });
  },
};
