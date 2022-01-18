const { Client } = require('discord.js');
const client = new Client({ intents: 32767 });
require('dotenv').config();
require('./handlers/eventHandler')(client);

client.login(process.env.BOT_TOKEN);
