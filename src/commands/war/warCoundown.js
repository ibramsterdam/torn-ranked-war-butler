const { CommandInteraction, MessageEmbed } = require('discord.js');
const { getTornRankedWarInfo } = require('../../util/tornApiUtil');
const { getMyFactionWarInfo } = require('../../util/rankedWarUtil');

module.exports = {
  name: 'warcountdown',
  cooldown: 10,
  description: 'Responds with if faction is at war with details',
  permission: 'ADMINISTRATOR',
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    Promise.all([getTornRankedWarInfo()]).then(function (results) {
      //Use randedWarUtil to return information in an array with objects
      const warObject = getMyFactionWarInfo(results[0].data.rankedwars);
      console.log(warObject);

      const response = new MessageEmbed()
        .setColor('AQUA')
        .setTitle(`${warObject[0].name}`)
        .setDescription(
          `${interaction.member} has set the enemy faction id that is going to be used in the war.`
        )
        .addField('Faction Id:', `test`, true);

      //Reply to the discord client
      interaction.reply({
        embeds: [response],
        fetchReply: true,
      });
    });
  },
};
