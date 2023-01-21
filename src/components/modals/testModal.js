module.exports = {
  data: { name: "test-modal" },
  async execute(interaction, client) {
    await interaction.reply({
      content: `Thanks for submitting ${interaction.fields.getTextInputValue(
        "test-modal-input"
      )}`,
    });
  },
};
