import { getUserFromTornApi } from "../../util/tornApiUtil";
import { getDashboardButtons } from "../functions/getDashboardButtons";
import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
import { getDiscordServer } from "../../functions/prisma/discord";
import { upsertFaction } from "../../functions/prisma/faction";
import {
  upsertUserAndConnectFaction,
  getUser,
} from "../../functions/prisma/user";
import {
  createApiKey,
  getUsersThatSharedTheirApiKeyOnDiscordServer,
  getApiKeyByValue,
} from "../../functions/prisma/apiKey";
import { getApiKeysEmbed } from "../functions/apiKeysEmbed";
import { prisma } from "../../index";

export async function execute(interaction: any, client: any) {
  await interaction.deferReply();
  const apiKey = interaction.fields.getTextInputValue("add-api-key-text-input") as string;

  // validate if apikey returns a user
  const result: any = await getUserFromTornApi(apiKey);
  if (result.data.error) {
    return await interaction.editReply("Not a valid key");
  }

  const guildID = BigInt(interaction.guildId);
  let server: any = await getDiscordServer(prisma, guildID);

  // validate if the key is not already in use on the server
  if (server.apiKeys.find((key: any) => key.value === apiKey)) {
    return await interaction.editReply(
      "Key is already connected to this server"
    );
  }

  // prevent the key beind used twice in our system
  const key = await getApiKeyByValue(prisma, apiKey);
  if (key) {
    return await interaction.editReply(
      "Key is already used in our system. If this is not supposed to be, please revoke the key on torn and reach out to the developer to remove it from the butler"
    );
  }

  const faction = await upsertFaction(
    prisma,
    result.data.faction.faction_id,
    result.data.faction.faction_name
  );

  const dbUser: any = await upsertUserAndConnectFaction(
    prisma,
    result.data.player_id,
    result.data.name,
    result.data.faction.faction_id
  );

  const user: any = await getUser(prisma, result.data.player_id);

  if (user.apiKey) {
    return await interaction.editReply(
      "Key you submitted is from a user that already has a key in use in our system"
    );
  }

  const dbApiKey = await createApiKey(prisma, apiKey, server.id, dbUser.id);
  const users = await getUsersThatSharedTheirApiKeyOnDiscordServer(
    prisma,
    guildID
  );
  server = await getDiscordServer(prisma, guildID);

  // create ui
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

export const data = { name: "add-api-key-modal" };
export const developer = false;
