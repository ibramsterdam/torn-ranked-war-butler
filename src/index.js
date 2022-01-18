const { Client, Collection } = require('discord.js');
const client = new Client({ intents: 32767 });
require('dotenv').config();
require('./handlers/eventHandler')(client);
require('./handlers/commandHandler')(client);

client.commands = new Collection();

client.login(process.env.BOT_TOKEN);
