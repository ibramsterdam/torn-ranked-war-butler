module.exports = {
  data: { name: "test-button" },
  async execute(interaction, client) {
    await interaction.reply("Test Click!");
  },
};
