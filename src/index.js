const {Client, Intents} = require('discord.js');
const {BOT_TOKEN} = require('../config.json');
const client = new Client({intents: [Intents.FLAGS.GUILDS]});
const commandHandler = require('./handlers/commandHandler')
const fs = require("fs");

/**
 * commandHandler
 */
client.on('interactionCreate', commandHandler);

/**
 * EventHandler
 */
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}


client.login(BOT_TOKEN);

module.exports = client;