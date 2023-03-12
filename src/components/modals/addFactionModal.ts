// @ts-nocheck
//TODO investigate this file

const { getFactionFromTornApi } = require("../../util/tornApiUtil");
const { getDashboardButtons } = require("../functions/getDashboardButtons");

const {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ChannelType,
} = require("discord.js");
const { getDiscordServer } = require("../../functions/prisma/discord");
const { upsertFaction } = require("../../functions/prisma/faction");
const {
  createFactionOnDiscordServerConnection,
  getConnectedFactionsOnDiscordServer,
} = require("../../functions/prisma/factionsOnDiscordServer");
const { getFactionsEmbed } = require("../functions/factionsEmbed");
const {
  createDiscordChannel,
} = require("../../functions/prisma/discordChannel");
const {
  upsertUser,
  removeUserRelationWithFaction,
} = require("../../functions/prisma/user");
const {
  getShortUrlAttackLink,
  getShortUrlProfileLink,
} = require("../../util/urlShortenerUtil");

module.exports = {
  data: { name: "add-faction-modal" },
  async execute(interaction, client) {
    //Reply to the discord client
    interaction.message.delete();
    await interaction.deferReply();

    const factionID = interaction.fields.getTextInputValue(
      "add-faction-text-input"
    );
    // validate if apikey returns a user
    if (!/^\d+$/.test(factionID)) {
      return await interaction.editReply(
        "Faction id is composed of numbers..."
      );
    }

    const guildID = BigInt(interaction.guildId);
    const prisma = require("../../index");
    let server = await getDiscordServer(prisma, guildID);

    // validate if faction is already being tracked
    if (
      server.factions.find((faction) => faction.factionId === Number(factionID))
    ) {
      return await interaction.editReply("Faction is already being tracked");
    }

    await interaction.editReply("Calling the torn api...");
    const result = await getFactionFromTornApi(
      factionID,
      server.apiKeys[0].value
    );

    if (result.data.error) {
      return await interaction.editReply("Invalid ID");
    }

    await interaction.editReply("Updating the butler database...");
    const faction = await upsertFaction(
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
      const attackLink = await getShortUrlAttackLink(Number(memberIdList[i]));
      const profileLink = await getShortUrlProfileLink(Number(memberIdList[i]));

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

    const factions = await getConnectedFactionsOnDiscordServer(
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
  },
};
