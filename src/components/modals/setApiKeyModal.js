module.exports = {
  data: { name: "set-api-key-modal" },
  async execute(interaction, client) {
    await interaction.reply({
      content: `Thanks for submitting ${interaction.fields.getTextInputValue(
        "set-api-key-text-input"
      )}`,
    });
  },
};
