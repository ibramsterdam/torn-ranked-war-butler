import { getDiscordServer } from "../../functions/prisma/discord";
import { generateMessages } from "../functions/status-messages/generateMessages";
import { prisma } from "../../index";
import { Client, CommandInteraction, TextChannel } from "discord.js";

export async function execute(interaction: CommandInteraction, client: Client) {
  await interaction.reply("Started Polling");
  setTimeout(async () => await interaction.deleteReply(), 5000);

  if (!interaction.guildId) return;

  const guildID = BigInt(interaction.guildId);
  const server = await getDiscordServer(prisma, guildID);

  if (!server || !server.factions || server.apiKeys.length === 0) {
    console.log("Error in startpolling");
    return;
  }

  for (const faction of server.factions) {
    const channel = client.channels.cache
      .filter((channel) => channel.id === faction.discordChannelId.toString())
      .first();

    if (channel && channel instanceof TextChannel) {
      await generateMessages(channel, faction.factionId, server, prisma);
    }
  }
}

export const data = { name: "dashboard-start-polling" };
export const developer = false;
