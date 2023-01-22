const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
module.exports = {
  data: { name: "dashboard-set-api-key" },
  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId("set-api-key-modal")
      .setTitle("Paste your api key");

    const textInput = new TextInputBuilder()
      .setCustomId("set-api-key-text-input")
      .setLabel("Api key is used for 20 requests per minute")
      .setRequired(true)
      .setMaxLength(16)
      .setMinLength(16)
      .setStyle(TextInputStyle.Short);

    modal.addComponents(new ActionRowBuilder().addComponents(textInput));
    await interaction.showModal(modal);
  },
};
