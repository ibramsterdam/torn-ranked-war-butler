const { getFaction } = require("../../util/tornApiUtil");
const { getDashboardButtons } = require("../functions/getDashboardButtons");

const {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: { name: "add-faction-modal" },
  async execute(interaction, client) {
    await interaction.deferReply();
    const factionId = interaction.fields.getTextInputValue(
      "add-faction-text-input"
    );

    // validate if apikey returns a user
    if (!/^\d+$/.test(factionId)) {
      return await interaction.editReply(
        "Faction id is composed of numbers..."
      );
    }

    const guildID = Number(interaction.guildId);
    const prisma = require("../../index");

    try {
      const apiKey = await prisma.apiKey.findFirst({
        where: {
          discordServer: {
            guildId: guildID,
          },
        },
      });

      const dbDiscordServer = await prisma.discordServer.findUnique({
        where: {
          guildId: guildID,
        },
        select: {
          apiKey: true,
          id: true,
        },
      });

      const response = await getFaction(factionId, apiKey.value);
      const dbFaction = await prisma.faction.upsert({
        where: {
          tornId: response.data.ID,
        },
        update: {
          name: response.data.name,
        },
        create: {
          tornId: response.data.ID,
          name: response.data.name,
        },
      });

      const connection = await prisma.factionsOnDiscordServer.upsert({
        where: {
          factionId_discordServerId: {
            discordServerId: dbDiscordServer.id,
            factionId: dbFaction.id,
          },
        },
        update: {},
        create: {
          discordServerId: dbDiscordServer.id,
          factionId: dbFaction.id,
        },
      });

      const connectedFaction = await prisma.factionsOnDiscordServer.findMany({
        where: {
          discordServerId: dbDiscordServer.id,
        },
        select: {
          faction: true,
        },
      });

      console.log(connectedFaction);

      const embeds = new EmbedBuilder()
        .setColor("Aqua")
        .setTitle("Manage Factions")
        .setDescription(
          `You have connected ${connectedFaction.length} factions`
        );

      //TODO
      const buttons = await getDashboardButtons("keys", false, false);

      const manageApiKeysButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("dashboard-add-faction")
          .setLabel("Add Faction")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("dashboard-remove-faction")
          .setLabel("Remove Faction")
          .setStyle(ButtonStyle.Secondary)
      );
      //Reply to the discord client
      interaction.message.delete();

      return await interaction.followUp({
        embeds: [embeds],
        components: [buttons, manageApiKeysButtons],
      });
    } catch (error) {
      console.log("Err while working with prisma", error);
    }

    await interaction.editReply({
      content: `something went wrong`,
    });
  },
};
