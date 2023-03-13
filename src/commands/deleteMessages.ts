import { SlashCommandBuilder, CommandInteraction, Client } from "discord.js";
import { getDiscordServer } from "../functions/prisma/discord";
import { prisma } from "../index";

export const developer = true;
export const data = new SlashCommandBuilder()
  .setName("delete-messages")
  .setDescription("Batch deletes messages (developer only)");

export async function execute(interaction: any, client: any) {
  await interaction.reply("Deleting...");
  setTimeout(async () => await interaction.deleteReply(), 5000);

  const guildID = BigInt(interaction.guildId);
  const server = await getDiscordServer(prisma, guildID);

  if (server) {
    for (const faction of server.factions) {
      const channel = await interaction.guild.channels.cache.get(
        faction.discordChannelId.toString()
      );

      // delete all possible messages
      await channel.bulkDelete(100, true).then(() => {
        console.log(
          "Messages deleted of ",
          faction.discordChannelId.toString()
        );
      });
    }
  }
}
