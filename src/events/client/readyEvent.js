const { Client } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  /**
   * @param {Client} client
   */
  execute(client) {
    console.log('The bot has booted up!');
    client.user.setActivity('TORN');
  },
};
