const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { getDashboardButtons } = require("../functions/getDashboardButtons");

module.exports = {
  data: { name: "dashboard-manage-api-keys" },
  async execute(interaction, client) {
    await interaction.message.delete();

    await interaction.deferReply();

    const embeds = new EmbedBuilder()
      .setTitle("Manage Api Keys")
      .setDescription("GOod luck!");
    const buttons = await getDashboardButtons("keys");

    const manageApiKeysButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("dashboard-set-api-key")
        .setLabel("Set Api Key")
        .setStyle(ButtonStyle.Secondary)
    );

    //Reply to the discord client
    await interaction.followUp({
      embeds: [embeds],
      components: [buttons, manageApiKeysButtons],
    });
  },
};
