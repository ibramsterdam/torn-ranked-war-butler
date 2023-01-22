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

    if (!butlerHQ) {
      const category = await interaction.guild.channels.create({
        name: "Ranked War Butler",
        type: ChannelType.GuildCategory,
      });
      const channel = await interaction.guild.channels.create({
        name: "butler-dashboard",
        type: ChannelType.GuildText,
        parent: category.id,
      });

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
          .setTitle("Ranked War Butler")
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
        buttons = await getDashboardButtons("noMenuType", true, true);
      } else {
        embeds = new EmbedBuilder()
          .setTitle("Ranked War Butler")
          .setDescription("Something went wrong, please contact the developer");
        buttons = await getDashboardButtons("noMenuType", true, true);
      }

      //Reply to the discord client
      await channel.send({
        embeds: [embeds],
        components: [buttons],
      });

      return interaction.followUp("Setup Successfull");
    }

    return interaction.followUp("You have already setup the butler");

    //Reply to the discord client
  },
};
