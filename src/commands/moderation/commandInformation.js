const { CommandInteraction, Client, MessageEmbed } = require('discord.js');
require('dotenv').config();

module.exports = {
  name: 'information',
  description: 'Responds with a list of all command information available',
  permission: 'ADMINISTRATOR',
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    //Make message
    const response = new MessageEmbed()
      .setColor('AQUA')
      .setTitle('Command List');

    //Loop over all commands and add to the response
    client.commands.forEach((command) => {
      response.addField(
        `Command: /${command.name}`,
        `${command.description}`,
        false
      );
    });

    //Reply to the discord client
    interaction.channel.send({
      embeds: [response],
      fetchReply: true,
    });
  },
};
