const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

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
    //Make message
    const response = new EmbedBuilder()
      .setColor("AQUA")
      .setTitle("Command List");

    //Loop over all commands and add to the response
    client.commands.forEach((command) => {
      response.addFields(
        `Command: /${command.name}`,
        `${command.description}`,
        false
      );
    });

    //Reply to the discord client
    interaction.reply({
      embeds: [response],
      fetchReply: true,
    });
  },
};
