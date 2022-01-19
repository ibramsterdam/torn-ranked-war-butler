const { CommandInteraction, MessageEmbed } = require('discord.js');
module.exports = {
  name: 'jailstatus',
  description:
    'Deletes a specified number of messages from channel or a target.',
  permission: 'ADMINISTRATOR',
  options: [
    {
      name: 'factionid',
      description:
        'Select the amount of messages to delete from a channel or a target.',
      type: 'NUMBER',
      required: true,
    },
  ],

  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    Promise.all([getTornRankedWarInfo()]).then(function (results) {
      const { options } = interaction;
      const targetFactionId = options.getNumber('factionid');

      //Use randedWarUtil to return information in an array with objects
      const warObject = getMyFactionWarInfo(
        results[0].data.rankedwars,
        targetFactionId
      );

      //If targetFactionId was invalid
      if (warObject === undefined) {
        interaction.reply({
          content: 'Invalid input',
        });
        return;
      }
    });
  },
};
