import { getFactionFromTornApi } from "../../util/tornApiUtil";
import { getDashboardButtons } from "../functions/getDashboardButtons";
import {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ChannelType,
} from "discord.js";
import { getDiscordServer } from "../../functions/prisma/discord";
import { upsertFaction } from "../../functions/prisma/faction";
import {
  createFactionOnDiscordServerConnection,
  getConnectedFactionsOnDiscordServer,
} from "../../functions/prisma/factionsOnDiscordServer";
import { getFactionsEmbed } from "../functions/factionsEmbed";
import { createDiscordChannel } from "../../functions/prisma/discordChannel";
import {
  upsertUser,
  removeUserRelationWithFaction,
} from "../../functions/prisma/user";
import {
  getShortUrlAttackLink,
  getShortUrlProfileLink,
} from "../../util/urlShortenerUtil";
import { prisma } from "../../index";

export async function execute(interaction: any, client: any) {
  //Reply to the discord client
  interaction.message.delete();
  await interaction.deferReply();

  const factionID = interaction.fields.getTextInputValue(
    "add-faction-text-input"
  );
  // validate if apikey returns a user
  if (!/^\d+$/.test(factionID)) {
    return await interaction.editReply("Faction id is composed of numbers...");
  }

  const guildID = BigInt(interaction.guildId);
  let server: any = await getDiscordServer(prisma, guildID);

  // validate if faction is already being tracked
  if (
    server.factions.find(
      (faction: any) => faction.factionId === Number(factionID)
    )
  ) {
    return await interaction.editReply("Faction is already being tracked");
  }

  await interaction.editReply("Calling the torn api...");
  const result: any = await getFactionFromTornApi(
    factionID,
    server.apiKeys[0].value
  );

  if (result.data.error) {
    return await interaction.editReply("Invalid ID");
  }

  await interaction.editReply("Updating the butler database...");
  const faction: any = await upsertFaction(
    prisma,
    result.data.ID,
    result.data.name
  );

  const memberList = Object.values(Object.values(result.data.members));
  const memberIdList = Object.keys(result.data.members);
  await removeUserRelationWithFaction(prisma, Number(factionID));

  for (let i = 0; i < memberIdList.length; i++) {
    if (i % 5 === 0) {
      await interaction.editReply(
        `Inserted **${i} / ${memberIdList.length}** users in database...`
      );
    }
    const attackLink: any = await getShortUrlAttackLink(
      Number(memberIdList[i])
    );
    const profileLink: any = await getShortUrlProfileLink(
      Number(memberIdList[i])
    );

    await upsertUser(
      prisma,
      Number(memberIdList[i]),
      memberList[i],
      faction.id,
      profileLink.data.data.shortUrl,
      attackLink.data.data.shortUrl
    );
  }

  await interaction.editReply("Creating a channel in discord...");
  // create factionChannel
  const channel = await interaction.guild.channels.create({
    name: `${faction.name}-${faction.id}`,
    type: ChannelType.GuildText,
    parent: server.discordCategory.id.toString(),
  });

  await createDiscordChannel(
    prisma,
    channel.id,
    channel.name,
    server.discordCategory.id,
    server.id
  );

  await interaction.editReply("Connecting faction to discord channel...");
  await createFactionOnDiscordServerConnection(
    prisma,
    server.id,
    faction.id,
    channel.id
  );

  const factions: any = await getConnectedFactionsOnDiscordServer(
    prisma,
    server.id
  );

  server = await getDiscordServer(prisma, guildID);
  await interaction.editReply("Done!");
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
      .setDisabled(factions.length === 0)
  );

  await interaction.deleteReply();
  //Reply to the discord client
  // interaction.message.delete();

  return await interaction.followUp({
    embeds: [embeds],
    components: [buttons, manageApiKeysButtons],
  });
}

export const data = { name: "add-faction-modal" };
export const developer = false;
