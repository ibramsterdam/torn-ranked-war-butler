import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";

import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const client: any = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember],
});

const { handleEvents } = require("./functions/handlers/eventHandler");
const { handleComponent } = require("./functions/handlers/componentHandler");

client.config = { token: process.env.BOT_TOKEN };
client.events = new Collection();
client.commands = new Collection();
client.buttons = new Collection<any, any>();
client.selectMenus = new Collection();
client.modals = new Collection();

const prisma = new PrismaClient();
handleEvents(client);
handleComponent(client);

client.login(client.config.token);
module.exports = prisma;
