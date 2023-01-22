const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
module.exports = {
  data: { name: "dashboard-remove-api-key" },
  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId("remove-api-key-modal")
      .setTitle("Remove your api key");

    const textInput = new TextInputBuilder()
      .setCustomId("remove-api-key-text-input")
      .setLabel("Please paste the torn id of the user")
      .setRequired(true)
      .setMaxLength(16)
      .setStyle(TextInputStyle.Short);

    modal.addComponents(new ActionRowBuilder().addComponents(textInput));
    await interaction.showModal(modal);
  },
};
