import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { getUsersThatSharedTheirApiKeyOnDiscordServer } from "../../functions/prisma/apiKey";
import { getDiscordServer } from "../../functions/prisma/discord";
import { getApiKeysEmbed } from "../functions/apiKeysEmbed";
import { getDashboardButtons } from "../functions/getDashboardButtons";
import { prisma } from "../../index";

export async function execute(interaction: any, client: any) {
  await interaction.deferReply();
  await interaction.message.delete();

  const guildID = BigInt(interaction.guildId);
  const users = await getUsersThatSharedTheirApiKeyOnDiscordServer(
    prisma,
    guildID
  );
  const server: any = await getDiscordServer(prisma, guildID);

  const embeds = await getApiKeysEmbed(users);
  const buttons = await getDashboardButtons(
    "keys",
    !server.isWhitelisted,
    server.apiKeys.length === 0,
    server.factions.length === 0
  );

  const manageApiKeysButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("dashboard-add-api-key")
      .setLabel("Add Api Key")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(server.apiKeys.length >= server.apiKeyAmount),
    new ButtonBuilder()
      .setCustomId("dashboard-remove-api-key")
      .setLabel("Remove Api Key")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(server.apiKeys.length === 0)
  );

  //Reply to the discord client
  await interaction.followUp({
    embeds: [embeds],
    components: [buttons, manageApiKeysButtons],
  });
}

export const data = { name: "dashboard-manage-api-keys" };
export const developer = false;
