const { getDashboardButtons } = require("../functions/getDashboardButtons");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: { name: "dashboard-manage-factions" },
  async execute(interaction, client) {
    interaction.message.delete();
    await interaction.deferReply();

    const embeds = new EmbedBuilder()
      .setTitle("Manage Factions")
      .setDescription(
        "This is not done yet and under development, so for now. Click away :)"
      );
    const buttons = await getDashboardButtons("factions");

    //Reply to the discord client
    await interaction.followUp({
      embeds: [embeds],
      components: [buttons],
    });
  },
};
