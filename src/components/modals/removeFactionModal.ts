import { getDashboardButtons } from "../functions/getDashboardButtons";

import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
import { getDiscordServer } from "../../functions/prisma/discord";
import { getFaction } from "../../functions/prisma/faction";
import {
  getConnectedFactionsOnDiscordServer,
  getConnectionBetweenFactionAndDiscordServer,
  deleteConnectionBetweenFactionAndDiscordServer,
} from "../../functions/prisma/factionsOnDiscordServer";
import { getFactionsEmbed } from "../functions/factionsEmbed";
import { deleteChannel } from "../../functions/prisma/discordChannel";
import { prisma } from "../../index";
export const data = { name: "remove-faction-modal" };
export async function execute(interaction: any, client: any) {
  await interaction.deferReply();
  const factionId = interaction.fields.getTextInputValue(
    "remove-faction-text-input"
  );

  // validate if apikey returns a user
  if (!/^\d+$/.test(factionId)) {
    return await interaction.editReply("Faction id is composed of numbers...");
  }

  const guildID = BigInt(interaction.guildId);

  let server: any = await getDiscordServer(prisma, guildID);
  const faction: any = await getFaction(prisma, Number(factionId));
  const connection: any = await getConnectionBetweenFactionAndDiscordServer(
    prisma,
    server.id,
    faction.id
  );

  if (!connection) {
    return await interaction.editReply("Faction is not connected");
  }

  // remove factionChannel & connection
  const deletedConnection: any =
    await deleteConnectionBetweenFactionAndDiscordServer(
      prisma,
      server.id,
      faction.id
    );
  await deleteChannel(prisma, connection.discordChannelId);

  const channelList = await interaction.guild.channels.fetch();
  if (
    channelList.find(
      (channel: any) =>
        channel.id === deletedConnection.discordChannelId.toString()
    )
  ) {
    await interaction.guild.channels.delete(
      deletedConnection.discordChannelId.toString()
    );
  }

  const connectedFactions: any = await getConnectedFactionsOnDiscordServer(
    prisma,
    server.id
  );
  const factions: any = await getConnectedFactionsOnDiscordServer(
    prisma,
    server.id
  );

  server = await getDiscordServer(prisma, guildID);
  // create ui
  const embeds = await getFactionsEmbed(factions);
  const buttons = await getDashboardButtons(
    "factions",
    !server.isWhitelisted,
    server.apiKeys.length === 0,
    server.factions.length === 0
  );
  const manageApiKeysButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("dashboard-add-faction")
      .setLabel("Add Faction")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(factions.length >= server.factionAmount),
    new ButtonBuilder()
      .setCustomId("dashboard-remove-faction")
      .setLabel("Remove Faction")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(connectedFactions.length === 0)
  );

  //Reply to the discord client
  interaction.message.delete();

  return await interaction.followUp({
    embeds: [embeds],
    components: [buttons, manageApiKeysButtons],
  });
}
