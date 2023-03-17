import { getDiscordServer } from "../../functions/prisma/discord";
import { generateMessages } from "../functions/status-messages/generateMessages";
import { prisma } from "../../index";
import { CommandInteraction } from "discord.js";

export async function execute(interaction: CommandInteraction, client: any) {
  await interaction.reply("Started Polling");
  setTimeout(async () => await interaction.deleteReply(), 5000);

  if (!interaction.guildId) return;

  const guildID = BigInt(interaction.guildId);
  const server: any = await getDiscordServer(prisma, guildID);

  for (const faction of server.factions) {
    await generateMessages(interaction, faction, server, prisma);
  }
}

export const data = { name: "dashboard-start-polling" };
export const developer = false;
