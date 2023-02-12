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
const { upsertUser } = require("../../functions/prisma/user");

module.exports = {
  data: { name: "add-faction-modal" },
  async execute(interaction, client) {
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

    const result = await getFactionFromTornApi(
      factionID,
      server.apiKeys[0].value
    );

    if (result.data.error) {
      return await interaction.editReply("Invalid ID");
    }

    const faction = await upsertFaction(
      prisma,
      result.data.ID,
      result.data.name
    );

    const memberList = Object.values(Object.values(result.data.members));
    const memberIdList = Object.keys(result.data.members);

    for (let i = 0; i < memberIdList.length; i++) {
      await upsertUser(
        prisma,
        Number(memberIdList[i]),
        memberList[i],
        faction.id
      );
    }

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

    //Reply to the discord client
    interaction.message.delete();

    return await interaction.followUp({
      embeds: [embeds],
      components: [buttons, manageApiKeysButtons],
    });
  },
};
