const { getDashboardButtons } = require("../functions/getDashboardButtons");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: { name: "dashboard-manage-api-keys" },
  async execute(interaction, client) {
    interaction.message.delete();
    await interaction.deferReply();

    const embeds = new EmbedBuilder()
      .setTitle("Manage Api Keys")
      .setDescription("GOod luck!");
    const buttons = await getDashboardButtons("keys");

    //Reply to the discord client
    await interaction.followUp({
      embeds: [embeds],
      components: [buttons],
    });
  },
};

//    const menu = new ActionRowBuilder().addComponents(
//   new StringSelectMenuBuilder()
//   .setCustomId(`test-menu`)
//   .setMinValues(1)
//   .setMaxValues(1)
//   .setOptions(
//     new StringSelectMenuOptionBuilder({
//       label: "Option One",
//       value: "Test Option One",
//     }),
//     new StringSelectMenuOptionBuilder({
//       label: "Option Two",
//       value: "Test Option Two",
//     })
//   )
// );
