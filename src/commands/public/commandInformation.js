const {
  EmbedBuilder,
  SlashCommandBuilder,
  CommandInteraction,
  ClientApplication,
} = require("discord.js");
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
   * @param {ClientApplication} client
   */
  async execute(interaction, client) {
    //Make message
    const response = new EmbedBuilder()
      .setColor("Aqua")
      .setTitle("Command List");

    client.commands //Loop over all commands and add to the response
      .forEach((command) => {
        response.addFields({
          name: `Command: /${command.data.name}`,
          value: `${command.data.description}`,
        });
      });

    //Reply to the discord client
    interaction.reply({
      embeds: [response],
      fetchReply: true,
    });
  },
};
