module.exports = {
  developer: false,
  data: { name: "dashboard-close-dashboard-button" },
  async execute(interaction, client) {
    return interaction.message.delete();
  },
};
