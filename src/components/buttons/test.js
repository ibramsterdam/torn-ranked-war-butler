module.exports = {
  data: { name: "Test" },
  async execute(interaction, client) {
    await interaction.reply("Test Click!");
  },
};
