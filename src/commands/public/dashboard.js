const {
  SlashCommandBuilder,
  CommandInteraction,
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const {
  getDashboardEmbed,
} = require("../../components/functions/getDashboardEmbed");
const {
  getDashboardButtons,
} = require("../../components/functions/getDashboardButtons");
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

    const embeds = await getDashboardEmbed();
    const buttons = await getDashboardButtons();

    //Reply to the discord client
    await interaction.followUp({
      embeds: [embeds],
      components: [buttons],
    });
  },
};
