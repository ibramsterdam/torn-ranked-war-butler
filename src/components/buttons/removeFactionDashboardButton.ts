// @ts-nocheck
//TODO investigate this file
const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
module.exports = {
  developer: false,

  data: { name: "dashboard-remove-faction" },
  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId("remove-faction-modal")
      .setTitle("Remove a faction");

    const textInput = new TextInputBuilder()
      .setCustomId("remove-faction-text-input")
      .setLabel("Please paste the torn id of the faction")
      .setRequired(true)
      .setMaxLength(16)
      .setStyle(TextInputStyle.Short);

    modal.addComponents(new ActionRowBuilder().addComponents(textInput));
    await interaction.showModal(modal);
  },
};
