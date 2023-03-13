import { getDashboardButtons } from "../functions/getDashboardButtons";
import { getUser } from "../../functions/prisma/user";
import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
import {
  getApiKeyFromUser,
  deleteApiKeyOfUser,
  getApiKeysThatAreUsedOnDiscordServer,
} from "../../functions/prisma/apiKey";
import { getDiscordServer } from "../../functions/prisma/discord";
import { getApiKeysEmbed } from "../functions/apiKeysEmbed";
import { prisma } from "../../index";

export async function execute(interaction: any, client: any) {
  await interaction.deferReply();
  const tornIdOfUser = interaction.fields.getTextInputValue(
    "remove-api-key-text-input"
  );

  // validate if apikey returns a user
  if (!/^\d+$/.test(tornIdOfUser)) {
    return await interaction.editReply("Torn Id is composed of numbers...");
  }

  const guildID: any = BigInt(interaction.guildId);
  const user = await getUser(prisma, Number(tornIdOfUser));

  if (!user) {
    return await interaction.editReply("Can't find this user");
  }
  const keys: any = await getApiKeysThatAreUsedOnDiscordServer(prisma, guildID);
  const userKey = await getApiKeyFromUser(prisma, user.id);

  // validate if the key exists on this server
  if (!keys.find((key: any) => key?.value === userKey?.value)) {
    return await interaction.editReply(
      "The key of the user you are trying to remove does exist"
    );
  }

  await deleteApiKeyOfUser(prisma, user.id);
  const users = await getApiKeysThatAreUsedOnDiscordServer(prisma, guildID);
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
  interaction.message.delete();

  return await interaction.followUp({
    embeds: [embeds],
    components: [buttons, manageApiKeysButtons],
  });
}

export const data = { name: "remove-api-key-modal" };
export const developer = false;
