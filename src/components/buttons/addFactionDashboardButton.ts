const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
module.exports = {
  developer: false,
  data: { name: "dashboard-add-faction" },
  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId("add-faction-modal")
      .setTitle("Add a Faction");

    const textInput = new TextInputBuilder()
      .setCustomId("add-faction-text-input")
      .setLabel("Please paste the torn id of the faction")
      .setRequired(true)
      .setMaxLength(16)
      .setStyle(TextInputStyle.Short);

    modal.addComponents(new ActionRowBuilder().addComponents(textInput));
    await interaction.showModal(modal);
  },
};
