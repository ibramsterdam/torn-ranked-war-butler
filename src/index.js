const { Client, Collection } = require('discord.js');
const client = new Client({ intents: 32767 });
require('dotenv').config();
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const Ascii = require('ascii-table');

['eventHandler', 'commandHandler'].forEach((handler) => {
  require(`./handlers/${handler}`)(client, PG, Ascii);
});

client.commands = new Collection();

client.login(process.env.BOT_TOKEN);
