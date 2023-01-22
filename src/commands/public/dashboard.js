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
    const prisma = require("../../index");
    const guildID = Number(interaction.guildId);
    let foundServer;
    let embeds;
    let buttons;

    try {
      foundServer = await prisma.discordServer.upsert({
        where: {
          guildId: guildID,
        },
        update: {},
        create: {
          guildId: guildID,
        },
        include: {
          apiKey: true,
          factions: true,
        },
      });
    } catch (error) {
      console.log("error", error);
    }

    if (foundServer) {
      embeds = new EmbedBuilder()
        .setTitle("Ranked War Assistant")
        .setDescription(
          `Buttons enable when you are whitelisted.
        Whitelisting happends when payment is made`
        )
        .addFields({
          name: "General information",
          value: `
          *Whitelist status* : ${foundServer.isWhitelisted ? "🟢" : "🔴"}
          *ApiKey status* : ${foundServer.apiKey.length} keys connected!
          *Polling speed* : ${
            foundServer.apiKey.length * 20 > 100
              ? 100
              : foundServer.apiKey.length * 20
          } requests per minute
          *Faction tracking status* : tracking ${
            foundServer.factions.length
          } factions!
          `,
        })
        .setColor("#00b0f4")
        .setFooter({
          text: "Good luck on warring!",
        })
        .setTimestamp();
      buttons = await getDashboardButtons(
        foundServer.isWhitelisted ? "" : "none"
      );
    } else {
      embeds = new EmbedBuilder()
        .setTitle("Ranked War Assistant")
        .setDescription("Something went wrong, please contact the developer");
      buttons = await getDashboardButtons("none");
    }

    //Reply to the discord client
    await interaction.followUp({
      embeds: [embeds],
      components: [buttons],
    });
  },
};
