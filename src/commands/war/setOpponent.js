const { CommandInteraction, MessageEmbed } = require('discord.js');
const { getFaction } = require('../../util/tornApiUtil');
const { saveEnemyFaction } = require('../../util/jsonStorageUtil');

module.exports = {
  name: 'setopponent',
  description: 'Save enemy faction id to json storage',
  permission: 'ADMINISTRATOR',
  options: [
    {
      name: 'factionid',
      description: 'Provide the enemy faction ID',
      type: 'STRING',
      required: true,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;
    const factionId = options.getString('factionid');

    //Make call to torn API
    Promise.all([getFaction(factionId)]).then(function (results) {
      //No faction found
      if (results[0] == undefined) {
        interaction.reply({
          content: 'Invalid input',
        });
        return;
      }

      //save to json storage
      saveEnemyFaction(factionId);

      const factionInfo = results[0].data;
      const response = new MessageEmbed()
        .setColor('AQUA')
        .setDescription(
          `${interaction.member} has set the enemy faction id that is going to be used in the war.`
        )
        .addField('Faction Id:', `${factionId}`, true)
        .addField('Faction Name:', `${factionInfo.name}`, true)
        .addField(
          'Faction members:',
          `${Object.keys(factionInfo.members).length}`,
          true
        );

      //Reply to the discord client
      interaction.reply({
        embeds: [response],
        fetchReply: true,
      });
    });
  },
};
