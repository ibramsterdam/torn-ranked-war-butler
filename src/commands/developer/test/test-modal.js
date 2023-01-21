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
    .setName("test-modal")
    .setDescription("Modal blueprint")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId("test-modal")
      .setTitle("Input something!");

    const textInput = new TextInputBuilder()
      .setCustomId("test-modal-input")
      .setLabel("Gimmi some input")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    modal.addComponents(new ActionRowBuilder().addComponents(textInput));
    await interaction.showModal(modal);
  },
};
