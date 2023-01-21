const {
  SlashCommandBuilder,
  ModalBuilder,
  PermissionFlagsBits,

  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("set-api-key")
    .setDescription("Insert Api key to be used for the bot")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId("set-api-key-modal")
      .setTitle("Input something!");

    const textInput = new TextInputBuilder()
      .setCustomId("set-api-key-text-input")
      .setLabel("Gimmi some input")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    modal.addComponents(new ActionRowBuilder().addComponents(textInput));
    await interaction.showModal(modal);
  },
};
