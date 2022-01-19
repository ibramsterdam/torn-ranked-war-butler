const {
  Client,
  CommandInteraction,
  MessageEmbed,
  Collection,
} = require('discord.js');
const { checkCooldown } = require('../../util/cooldownUtil');

module.exports = {
  name: 'interactionCreate',
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) {
        return (
          interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor('RED')
                .setDescription(
                  '⛔ An error occured while running this command'
                ),
            ],
            //Delete command if it failed so bot does not crash
          }) && client.commands.delete(interaction.commandName)
        );
      }

      //Check if member has cooldown on command.
      if (checkCooldown(command, interaction)) {
        return;
      }

      //Execure command
      command.execute(interaction, client);
    }
  },
};
