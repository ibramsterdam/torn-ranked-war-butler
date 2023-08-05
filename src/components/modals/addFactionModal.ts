import {
  getFactionFromTornApi,
  getUserFromTornApiById,
} from "../../util/tornApiUtil";
import { getDashboardButtons } from "../functions/getDashboardButtons";
import {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ChannelType,
  ModalSubmitInteraction,
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
  updateUserPersonalStats,
} from "../../functions/prisma/user";
import {
  getShortUrlAttackLink,
  getShortUrlProfileLink,
} from "../../util/urlShortenerUtil";
import { prisma } from "../../index";
import { generateMessages } from "../functions/status-messages/generateMessages";
import { getBrainSurgeonApiKeys } from "../../functions/prisma/apiKey";
import { getRandomItemFromArray } from "../../util/randomItemFromArray";

export async function execute(
  interaction: ModalSubmitInteraction,
  client: any
) {
  if (!interaction.message || !interaction.guildId || !interaction.guild) {
    return;
  }

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
  const factionFromApi = await getFactionFromTornApi(
    Number(factionID),
    server.apiKeys[0].value
  );

  if (!factionFromApi) {
    return await interaction.editReply("Invalid ID");
  }

  await interaction.editReply("Updating the butler database...");
  const faction = await upsertFaction(
    prisma,
    factionFromApi.ID,
    factionFromApi.name
  );

  if (!faction) {
    console.log("ERROR IN ADDFACTIONMODAL");
    return;
  }

  const memberList = Object.values(Object.values(factionFromApi.members));
  const memberIdList = Object.keys(factionFromApi.members);
  await removeUserRelationWithFaction(prisma, Number(factionID));
  const userList = [];

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

    userList.push({ id: memberIdList[i] });

    await upsertUser(
      prisma,
      Number(memberIdList[i]),
      memberList[i],
      faction.id,
      profileLink.data.url.short_url,
      attackLink.data.url.short_url
    );
  }
  await interaction.editReply("Creating a channel in discord...");
  // create factionChannel
  const channel = await interaction.guild.channels.create({
    name: `${faction.name}-${faction.id}`,
    type: ChannelType.GuildText,
    parent: server.discordCategory.id.toString(),
  });

  if (!channel) {
    console.log("Error in generateMessages");
    return await interaction.editReply(
      "Error in creating a channel, try again and if this persists contact the developer"
    );
  }
  await createDiscordChannel(
    prisma,
    BigInt(channel.id),
    channel.name,
    server.discordCategory.id,
    server.id
  );

  await interaction.editReply("Connecting faction to discord channel...");
  await createFactionOnDiscordServerConnection(
    prisma,
    server.id,
    faction.id,
    BigInt(channel.id)
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
      .setDisabled(factions.length === 0)
  );

  const keys = await getBrainSurgeonApiKeys(prisma);
  let i = 0;
  for (const user of userList) {
    if (i % 5 === 0) {
      await interaction.editReply(
        `Updated **${i} / ${memberIdList.length}** users with their personalstats...`
      );
    }
    i++;
    const randomApiKeyObject = getRandomItemFromArray(keys);
    const latestUserInfo: any = await getUserFromTornApiById(
      randomApiKeyObject.value,
      Number(user.id)
    );

    if (latestUserInfo.data.error) {
      console.log("Error in while fetching a user while adding a faction");
    } else {
      await updateUserPersonalStats(
        prisma,
        Number(user.id),
        latestUserInfo.data.personalstats,
        latestUserInfo.data.age,
        latestUserInfo.data.revivable
      );
    }
  }
  await interaction.editReply("Done!");
  await interaction.deleteReply();

  await interaction.followUp({
    embeds: [embeds],
    components: [buttons, manageApiKeysButtons],
  });

  return await generateMessages(channel, faction.id, server, prisma);
}

export const data = { name: "add-faction-modal" };
export const developer = false;
