const { CommandInteraction, MessageEmbed } = require('discord.js');
const { getFaction } = require('../../util/tornApiUtil');

module.exports = {
  name: 'hospitalstatus',
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
    const { options } = interaction;
    const targetFactionId = options.getNumber('factionid');
    const hospitalMap = new Map();

    Promise.all([getFaction(targetFactionId)]).then(function (results) {
      //Destructure Json to array of faction members
      const factionInfo = Object.values(Object.values(results[0].data)[14]);
      // console.log(factionInfo);
      const response = new MessageEmbed().setColor('AQUA').setDescription(
        `${
          interaction.member
        } has asked for the the hospital list <t:${Math.round(
          Date.now() / 1000
        )}:R>.
          Important: This list does not update on its own when someone takes medication. Also, switch channels if timestamps dont seem to update.`
      );

      factionInfo.forEach((factionMember) => {
        if (factionMember.status.description.includes('In hospital')) {
          hospitalMap.set(factionMember.name, factionMember.status.until);
          response.addField(
            `${factionMember.name}`,
            `Leaving hospital <t:${factionMember.status.until}:R>`
          );
        }
      });

      //Reply to the discord client
      interaction.reply({
        embeds: [response],
        fetchReply: true,
      });
    });
  },
};
