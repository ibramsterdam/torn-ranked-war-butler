const {
  SlashCommandBuilder,
  CommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");

const {
  getDashboardButtons,
} = require("../components/functions/getDashboardButtons");
const { getDiscordServer } = require("../functions/prisma/discord");
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

    const guildID = BigInt(interaction.guildId);
    const prisma = require("../index");
    const server = await getDiscordServer(prisma, guildID);

    if (!server) {
      return await interaction.followUp(
        `Unable to find the server, have you run the /setup command already? If so, please contact the developer...`
      );
    }
    const butlerChannel = server.discordChannel.find(
      (channel) => channel.name === "butler-dashboard"
    );

    if (!butlerChannel) {
      return await interaction.followUp(
        `No Butler Dashboard Channel was found.\nPlease run the command /setup`
      );
    }

    if (BigInt(interaction.channelId) !== butlerChannel.id) {
      return await interaction.followUp(
        "Please use the Butler Dashboard Channel for this command"
      );
    }

    // remove channel messages
    const messages = await interaction.channel.messages.fetch();
    const key = messages.entries().next().value[0];
    messages.delete(key);
    interaction.channel.bulkDelete(messages);

    const embeds = new EmbedBuilder()
      .setTitle("Ranked War Butler")
      .setDescription(
        "Welcome to the dashboard! From here you can manage which factions you would like to track."
      )
      .addFields(
        {
          name: "General information",
          value: `
          **Whitelist status:** ${server.isWhitelisted ? "🟢" : "🔴"}
          **ApiKey status:** ${server.apiKeys.length}/${server.apiKeyAmount}
          **Faction tracking status:** ${server.factions.length}/${
            server.factionAmount
          }
          `,
        },
        {
          name: "Other information",
          value: `
          1. Buttons enable when you are whitelisted.
          2. Whitelisting happends when payment is made to the developer
          3. If any problems arise, please reach out to the developer
          4. How many apikeys and factions can be connected depends on the deal you made with the developer
          `,
        }
      )
      .setColor("#00b0f4")
      .setFooter({
        text: "Good luck on warring!",
      })
      .setTimestamp();

    const buttons = await getDashboardButtons(
      "noMenuType",
      !server.isWhitelisted,
      server.apiKeys.length === 0
    );

    //Reply to the discord client
    return await interaction.followUp({
      embeds: [embeds],
      components: [buttons],
    });
  },
};
