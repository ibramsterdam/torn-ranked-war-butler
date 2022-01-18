const { CommandInteraction } = require('discord.js');
const { getTornRankedWarInfo } = require('../../util/tornApiUtil');
const { isObject, objProps } = require('../../util/objectUtil');
require('dotenv').config();

module.exports = {
  name: 'warcountdown',
  description: 'Responds with if faction is at war with details',
  permission: 'ADMINISTRATOR',
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    Promise.all([getTornRankedWarInfo()]).then(function (results) {
      const rankedWarList = results[0].data.rankedwars;

      console.log(rankedWarList);

      objProps(rankedWarList);
    });
  },
};
