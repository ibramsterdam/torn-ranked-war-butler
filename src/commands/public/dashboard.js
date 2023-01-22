const {
  SlashCommandBuilder,
  CommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");

const {
  getDashboardButtons,
} = require("../../components/functions/getDashboardButtons");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("dashboard")
    .setDescription("Manage your Butler"),
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();

    const buttons = await getDashboardButtons();
    const embeds = new EmbedBuilder()
      .setTitle("Ranked War Assistant")
      .setDescription("Whitelisting happends when payment is made")
      .addFields(
        {
          name: "General information",
          value:
            "*Whitelist status* : <Yes/no>\n*ApiKey status* : <x keys connected>\n*Polling speed* : <60 requests p/m>",
        },
        {
          name: "Tracking the following factions",
          value: "Barry\nMaud\nHarry\nBanoe",
          inline: true,
        },
        {
          name: "Using the Api keys from",
          value: "Barry\nMaud\nHarry\nBanoe",
          inline: true,
        }
      )
      .setColor("#00b0f4")
      .setFooter({
        text: "Good luck on warring!",
        iconURL: "https://slate.dan.onl/slate.png",
      })
      .setTimestamp();

    //Reply to the discord client
    await interaction.followUp({
      embeds: [embeds],
      components: [buttons],
    });
  },
};
