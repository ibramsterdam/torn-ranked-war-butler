const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
module.exports = {
  developer: false,
  data: { name: "dashboard-add-api-key" },
  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId("add-api-key-modal")
      .setTitle("Paste your api key");

    const textInput = new TextInputBuilder()
      .setCustomId("add-api-key-text-input")
      .setLabel("Api key is used for 20 requests per minute")
      .setRequired(true)
      .setMaxLength(16)
      .setMinLength(16)
      .setStyle(TextInputStyle.Short);

    modal.addComponents(new ActionRowBuilder().addComponents(textInput));
    await interaction.showModal(modal);
  },
};
