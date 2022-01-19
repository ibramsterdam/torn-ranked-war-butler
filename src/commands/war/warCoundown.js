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
      const factionInfo = warObject[Object.keys(warObject)[0]];
      const warInfo = warObject[Object.keys(warObject)[1]];
      const startDateTimestamp = new Date(warInfo.start * 1000);
      const date = new Date(startDateTimestamp);
      const dateInfo =
        date.getDate() +
        '/' +
        (date.getMonth() + 1) +
        '/' +
        date.getFullYear() +
        ' ' +
        date.getHours() +
        ':' +
        date.getMinutes() +
        ':' +
        date.getSeconds() +
        ' Torn Time';

      //Create message
      const response = new MessageEmbed()
        .setColor('AQUA')
        .setTitle(
          `${factionInfo[Object.keys(factionInfo)[0]].name} vs ${
            factionInfo[Object.keys(factionInfo)[1]].name
          }`
        )
        .setDescription(`The war starts at ${dateInfo}`);

      //War has begun!
      if (Date.now() > startDateTimestamp) {
        response.setDescription(`The war has begun!`).addFields(
          {
            name: `${factionInfo[Object.keys(factionInfo)[0]].name}`,
            value: `Score: ${factionInfo[Object.keys(factionInfo)[0]].score}
        Chain: ${factionInfo[Object.keys(factionInfo)[0]].chain}
        `,
            inline: true,
          },
          {
            name: `${factionInfo[Object.keys(factionInfo)[1]].name}`,
            value: `Score: ${factionInfo[Object.keys(factionInfo)[1]].score}
        Chain: ${factionInfo[Object.keys(factionInfo)[1]].chain}
        `,
            inline: true,
          }
        );
      }

      if (warInfo.winner !== 0) {
        console.log(warObject);
        response
          .setDescription(`The war has ended!`)
          .addField('Winner', 'test');
      }

      //Reply to the discord client
      interaction.reply({
        embeds: [response],
        fetchReply: true,
      });
    });
  },
};
