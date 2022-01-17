const {Client, Intents} = require('discord.js');
const {BOT_TOKEN} = require('../config.json');
const client = new Client({intents: [Intents.FLAGS.GUILDS]});
const commandHandler = require('./handlers/commandHandler')

client.on('interactionCreate', commandHandler)

client.once('ready', () => {
    console.log('Bot booted up!');
});

client.login(BOT_TOKEN);

module.exports = client;