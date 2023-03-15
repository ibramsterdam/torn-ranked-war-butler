import {
  SlashCommandBuilder,
  CommandInteraction,
  Client,
  TextChannel,
} from "discord.js";
import { getDiscordServer } from "../functions/prisma/discord";
import { prisma } from "../index";

export const developer = true;
export const data = new SlashCommandBuilder()
  .setName("delete-messages")
  .setDescription("Batch deletes messages (developer only)");

export async function execute(interaction: CommandInteraction, client: Client) {
  await interaction.reply("Deleting...");
  setTimeout(async () => await interaction.deleteReply(), 5000);

  if (!interaction.guildId)
    return interaction.editReply(
      "Something went wrong with finding the server id, please contact the developer"
    );

  const guildID = BigInt(interaction.guildId);
  const server = await getDiscordServer(prisma, guildID);

  if (!server) return;

  for (const faction of server.factions) {
    if (!interaction.guild) return;

    const channel = await interaction.guild.channels.cache.get(
      faction.discordChannelId.toString()
    );

    if (!channel) return;
    // delete all possible messages
    await (channel as TextChannel).bulkDelete(100, true).then(() => {
      console.log("Messages deleted of", faction.discordChannelId.toString());
    });
  }
}
