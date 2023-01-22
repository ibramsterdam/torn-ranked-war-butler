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
    const category = await interaction.guild.channels.create({
      name: "Ranked War Butler",
      type: ChannelType.GuildCategory,
    });
    const channel = await interaction.guild.channels.create({
      name: "HQ",
      type: ChannelType.GuildText,
      parent: category.id,
    });

    console.log(channel.id);
    //Reply to the discord client
    return interaction.followUp("DONE" + channel.id.toString());
  },
};
