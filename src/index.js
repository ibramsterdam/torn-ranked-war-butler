const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const { PrismaClient } = require("@prisma/client");

const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
require("dotenv").config();

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require("./functions/handlers/eventHandler");

client.config = { token: process.env.BOT_TOKEN };
client.events = new Collection();
client.commands = new Collection();

loadEvents(client);

const prisma = new PrismaClient();

client.login(client.config.token);

module.exports = prisma;
