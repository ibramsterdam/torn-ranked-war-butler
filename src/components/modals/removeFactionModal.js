const { getFaction } = require("../../util/tornApiUtil");
const { getDashboardButtons } = require("../functions/getDashboardButtons");

const {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: { name: "remove-faction-modal" },
  async execute(interaction, client) {
    await interaction.deferReply();
    const factionId = interaction.fields.getTextInputValue(
      "remove-faction-text-input"
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
      const dbDiscordServer = await prisma.discordServer.findUnique({
        where: {
          guildId: guildID,
        },
      });

      const dbFaction = await prisma.faction.findUnique({
        where: {
          tornId: Number(factionId),
        },
      });

      const connection = await prisma.factionsOnDiscordServer.findUnique({
        where: {
          factionId_discordServerId: {
            discordServerId: dbDiscordServer.id,
            factionId: dbFaction.id,
          },
        },
      });

      if (!connection) {
        return await interaction.editReply("Faction id not found");
      }

      const deletedConnection = await prisma.factionsOnDiscordServer.delete({
        where: {
          factionId_discordServerId: {
            discordServerId: dbDiscordServer.id,
            factionId: dbFaction.id,
          },
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

      const embeds = new EmbedBuilder()
        .setColor("Aqua")
        .setTitle("Manage Factions")
        .setDescription(
          `You have connected ${connectedFaction.length} factions`
        );

      //TODO
      const buttons = await getDashboardButtons("factions", false, false);

      const manageApiKeysButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("dashboard-add-faction")
          .setLabel("Add Faction")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("dashboard-remove-faction")
          .setLabel("Remove Faction")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(connectedFaction.length === 0)
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
