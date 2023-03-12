import { getDashboardButtons } from "../functions/getDashboardButtons";
import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { getDiscordServer } from "../../functions/prisma/discord";
import { getConnectedFactionsOnDiscordServer } from "../../functions/prisma/factionsOnDiscordServer";
import { getFactionsEmbed } from "../functions/factionsEmbed";
import { prisma } from "../../index";
module.exports = {
  developer: false,
  data: { name: "dashboard-manage-factions" },
  async execute(interaction: any, client: any) {
    interaction.message.delete();
    await interaction.deferReply();
    const guildID = BigInt(interaction.guildId);

    const server: any = await getDiscordServer(prisma, guildID);
    const factions = await getConnectedFactionsOnDiscordServer(
      prisma,
      server.id
    );

    const manageFactionsButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("dashboard-add-faction")
        .setLabel("Add Faction ")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(server.factions.length >= server.factionAmount),
      new ButtonBuilder()
        .setCustomId("dashboard-remove-faction")
        .setLabel("Remove Faction")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(server.factions.length === 0)
    );

    const embeds = await getFactionsEmbed(factions);
    const buttons = await getDashboardButtons(
      "factions",
      !server.isWhitelisted,
      server.apiKeys.length === 0,
      server.factions.length === 0
    );

    //Reply to the discord client
    await interaction.followUp({
      embeds: [embeds],
      components: [buttons, manageFactionsButtons],
    });
  },
};
