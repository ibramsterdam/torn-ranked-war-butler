import {
  Client,
  Collection,
  //@ts-ignore
  GatewayIntentBits,
  Partials,
} from "discord.js";
import { PrismaClient } from "@prisma/client";
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
import * as dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember],
}) as any;

import { handleEvents } from "./functions/handlers/eventHandler";
import { handleComponent } from "./functions/handlers/componentHandler";

client.config = { token: process.env.BOT_TOKEN };
client.events = new Collection();
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();

export const prisma = new PrismaClient();
handleEvents(client);
handleComponent(client);

client.login(client.config.token);
