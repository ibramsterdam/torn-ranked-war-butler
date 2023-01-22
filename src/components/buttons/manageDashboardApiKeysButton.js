const { getDashboardEmbed } = require("../functions/getDashboardEmbed");
const { getDashboardButtons } = require("../functions/getDashboardButtons");
const {
  StringSelectMenuBuilder,
  ActionRowBuilder,
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: { name: "dashboard-manage-api-keys" },
  async execute(interaction, client) {
    interaction.message.delete();
    await interaction.deferReply();

    const embeds = await getDashboardEmbed();
    const buttons = await getDashboardButtons();

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`test-menu`)
        .setMinValues(1)
        .setMaxValues(1)
        .setOptions(
          new StringSelectMenuOptionBuilder({
            label: "Option One",
            value: "Test Option One",
          }),
          new StringSelectMenuOptionBuilder({
            label: "Option Two",
            value: "Test Option Two",
          })
        )
    );

    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("dashboard")
        .setLabel("Go Back")
        .setStyle(ButtonStyle.Danger)
    );
    //Reply to the discord client
    await interaction.followUp({
      embeds: [embeds],
      components: buttons,
    });
  },
};
