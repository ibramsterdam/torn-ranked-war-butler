const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const {
  getUsersThatSharedTheirApiKeyOnDiscordServer,
} = require("../../functions/prisma/apiKey");
const { getDiscordServer } = require("../../functions/prisma/discord");
const { getDashboardButtons } = require("../functions/getDashboardButtons");

module.exports = {
  developer: false,

  data: { name: "dashboard-manage-api-keys" },
  async execute(interaction, client) {
    await interaction.deferReply();
    await interaction.message.delete();

    const guildID = Number(interaction.guildId);
    const prisma = require("../../index");
    const users = await getUsersThatSharedTheirApiKeyOnDiscordServer(
      guildID,
      prisma
    );
    const server = await getDiscordServer(guildID, prisma);

    const embeds = new EmbedBuilder()
      .setColor("Aqua")
      .setTitle("Manage Api Keys")
      .setDescription(
        `
      For every key that you add, you are allowed to add 3 factions to track. 
      You have ${users.length} api keys connected and are allowed to track ${
          users.length * 3
        } factions\n
      
      Please remember
      *1. We make sure that every key is from a different user and only use the key for the discord server that it is inserted in.*
      *2. We handle these keys with absolute secrecy*
      *3. Anyone trying to manipulate this bot forfeits the right to use it*
      `
      );

    users.forEach((object) => {
      embeds.addFields({
        name: `${object.user.name} [${object.user.tornId}]`,
        value: `Profile: [Click here!](https://www.torn.com/profiles.php?XID=${object.user.tornId})
        Faction: [${object.user.faction.name}](https://www.torn.com/factions.php?step=profile&ID=${object.user.faction.tornId}#/)`,
      });
    });
    const buttons = await getDashboardButtons(
      "keys",
      !server.isWhitelisted,
      server.apiKey.length === 0
    );

    const manageApiKeysButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("dashboard-add-api-key")
        .setLabel("Add Api Key")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("dashboard-remove-api-key")
        .setLabel("Remove Api Key")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(server.apiKey.length === 0)
    );

    //Reply to the discord client
    await interaction.followUp({
      embeds: [embeds],
      components: [buttons, manageApiKeysButtons],
    });
  },
};
