const {
  SlashCommandBuilder,
  CommandInteraction,
  Client,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const {
  getDashboardButtons,
} = require("../../components/functions/getDashboardButtons");
const { upsertDiscordServer } = require("../../functions/prisma/discord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Create the space for the butler to work in"),
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();

    const channelList = await interaction.guild.channels.fetch();
    const butlerHQ = channelList.find(
      (channel) => channel.name === "Ranked War Butler"
    );

    if (butlerHQ) {
      return interaction.followUp("You have already setup the butler");
    }

    const category = await interaction.guild.channels.create({
      name: "Ranked War Butler",
      type: ChannelType.GuildCategory,
    });
    const channel = await interaction.guild.channels.create({
      name: "butler-dashboard",
      type: ChannelType.GuildText,
      parent: category.id,
    });

    const guildID = Number(interaction.guildId);
    const prisma = require("../../index");

    const server = await upsertDiscordServer(prisma, guildID);

    if (!server) {
      return interaction.followUp(
        "Something is going wrong, please contact the developer"
      );
    }

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
    await channel.send({
      embeds: [embeds],
      components: [buttons],
    });

    return interaction.followUp("Setup Successfull");
  },
};
