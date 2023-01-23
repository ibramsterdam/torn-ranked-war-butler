const {
  SlashCommandBuilder,
  CommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");

const {
  getDashboardButtons,
} = require("../../components/functions/getDashboardButtons");
const { getDiscordServer } = require("../../functions/prisma/discord");
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

    // check if the /setup command was run on the server
    const channelList = await interaction.guild.channels.fetch();
    const butlerDashboardChannel = channelList.find(
      (channel) => channel.name === "butler-dashboard"
    );

    if (!butlerDashboardChannel) {
      return await interaction.followUp(
        `No Butler Dashboard Channel was found.\nPlease run the command /setup`
      );
    }

    if (interaction.channelId !== butlerDashboardChannel?.id) {
      return await interaction.followUp(
        "Please use the Butler Dashboard Channel for this command"
      );
    }

    // remove channel messages
    const messages = await interaction.channel.messages.fetch();
    const key = messages.entries().next().value[0];
    messages.delete(key);
    interaction.channel.bulkDelete(messages);

    // create the message
    const guildID = Number(interaction.guildId);
    let embeds;
    let buttons;
    const prisma = require("../../index");

    const server = await getDiscordServer(prisma, guildID);

    if (server) {
      embeds = new EmbedBuilder()
        .setTitle("Ranked War Butler")
        .setDescription(
          `Buttons enable when you are whitelisted.
        Whitelisting happends when payment is made`
        )
        .addFields({
          name: "General information",
          value: `
          *Whitelist status* : ${server.isWhitelisted ? "🟢" : "🔴"}
          *ApiKey status* : ${server.apiKey.length} keys connected!
          *Polling speed* : ${
            server.apiKey.length * 20 > 100 ? 100 : server.apiKey.length * 20
          } requests per minute
          *Faction tracking status* : tracking ${
            server.factions.length
          } factions!
          `,
        })
        .setColor("#00b0f4")
        .setFooter({
          text: "Good luck on warring!",
        })
        .setTimestamp();

      buttons = await getDashboardButtons(
        "noMenuType",
        !server.isWhitelisted,
        server.apiKey.length === 0
      );
    } else {
      embeds = new EmbedBuilder()
        .setTitle("Ranked War Butler")
        .setDescription("Something went wrong, please contact the developer");
      buttons = await getDashboardButtons("noMenyType", true, true);
    }

    //Reply to the discord client
    await interaction.followUp({
      embeds: [embeds],
      components: [buttons],
    });
  },
};
