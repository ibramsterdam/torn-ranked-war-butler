module.exports = {
  data: { name: "dashboard-close-dashboard-button" },
  async execute(interaction, client) {
    return interaction.message.delete();
  },
};
