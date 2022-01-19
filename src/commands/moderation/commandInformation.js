const { CommandInteraction, Client, MessageEmbed } = require('discord.js');
require('dotenv').config();

module.exports = {
  name: 'commandinformation',
  description: 'Responds with a list of all command information available',
  cooldown: 10,
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
    interaction.reply({
      embeds: [response],
      fetchReply: true,
    });
  },
};
