const {
  EmbedBuilder,
  SlashCommandBuilder,
  CommandInteraction,
  Client,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("commandinformation")
    .setDescription(
      "Responds with a list of all command information available"
    ),
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();
    const channelList = await interaction.guild.channels.fetch();
    const butlerHQ = channelList.find(
      (channel) => channel.name === "butler-dashboard"
    );

    if (!butlerHQ) {
      return await interaction.followUp(
        "Please use the Butler Dashboard Channel"
      );
    }
    //Make message
    const response = new EmbedBuilder()
      .setColor("AQUA")
      .setTitle("Command List");

    client.commands //Loop over all commands and add to the response
      .forEach((command) => {
        if (!command.data.name.includes("test")) {
          response.addFields({
            name: `Command: /${command.data.name}`,
            value: `${command.data.description}`,
          });
        }
      });

    //Reply to the discord client
    interaction.followUp({
      embeds: [response],
      fetchReply: true,
    });
  },
};
