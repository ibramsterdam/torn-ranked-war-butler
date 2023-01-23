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
    const server = await upsertDiscordServer(guildID);

    const embeds = new EmbedBuilder()
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
    const buttons = await getDashboardButtons(
      "noMenuType",
      !server.isWhitelisted,
      server.apiKey.length === 0
    );

    //Reply to the discord client
    await channel.send({
      embeds: [embeds],
      components: [buttons],
    });

    return interaction.followUp("Setup Successfull");
  },
};
