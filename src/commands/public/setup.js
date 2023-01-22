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
      console.log("IN");
      const category = await interaction.guild.channels.create({
        name: "Ranked War Butler",
        type: ChannelType.GuildCategory,
      });
      const channel = await interaction.guild.channels.create({
        name: "Oi",
        type: ChannelType.GuildText,
        parent: category.id,
      });
      return interaction.followUp("Setup Successfull");
    }

    return interaction.followUp("You have already setup the butler");

    //Reply to the discord client
  },
};
