const { getUser } = require("../../util/tornApiUtil");
const { getDashboardButtons } = require("../functions/getDashboardButtons");

const {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: { name: "set-api-key-modal" },
  async execute(interaction, client) {
    await interaction.deferReply();
    const apiKey = interaction.fields.getTextInputValue(
      "set-api-key-text-input"
    );

    // validate if apikey returns a user
    const user = await getUser(apiKey);
    console.log(user.data);
    if (user.data.error) {
      return await interaction.editReply("Not a valid key");
    }

    const guildID = Number(interaction.guildId);
    const prisma = require("../../index");

    console.log("OI");
    console.log(user.data.faction.faction_id);

    try {
      const dbDiscordServer = await prisma.discordServer.findUnique({
        where: {
          guildId: guildID,
        },
      });
      const dbFaction = await prisma.faction.upsert({
        where: {
          tornId: user.data.faction.faction_id,
        },
        update: {
          name: user.data.faction.faction_name,
        },
        create: {
          tornId: user.data.faction.faction_id,
          name: user.data.faction.faction_name,
        },
      });
      const dbUser = await prisma.user.upsert({
        where: {
          tornId: user.data.player_id,
        },
        update: {
          name: user.data.name,
          faction: {
            connect: { tornId: user.data.faction.faction_id },
          },
        },
        create: {
          tornId: user.data.player_id,
          name: user.data.name,
          faction: {
            connect: { tornId: user.data.faction.faction_id },
          },
        },
      });

      const dbApiKey = await prisma.apiKey.upsert({
        where: {
          value: apiKey,
        },
        update: {
          value: apiKey,
          discordServerId: dbDiscordServer.id,
          userId: dbUser.id,
        },
        create: {
          value: apiKey,
          discordServerId: dbDiscordServer.id,
          userId: dbUser.id,
        },
      });

      const countKeysForGuild = await prisma.apiKey.count({
        where: {
          discordServerId: dbDiscordServer.id,
        },
      });

      const embeds = new EmbedBuilder()
        .setTitle("Manage Api Keys")
        .setDescription(`Keys logged: ${countKeysForGuild}`);
      const buttons = await getDashboardButtons("keys");

      const manageApiKeysButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("dashboard-set-api-key")
          .setLabel("Set Api Key")
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
