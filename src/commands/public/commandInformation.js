const {
  EmbedBuilder,
  SlashCommandBuilder,
  CommandInteraction,
  ClientApplication,
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
   * @param {ClientApplication} client
   */
  async execute(interaction, client) {
    //Make message
    const response = new EmbedBuilder()
      .setColor("AQUA")
      .setTitle("Command List");

    client.commands //Loop over all commands and add to the response
      .forEach((command) => {
        console.log("command", command);
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
