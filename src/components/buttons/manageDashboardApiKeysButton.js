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
      prisma,
      guildID
    );
    const server = await getDiscordServer(prisma, guildID);

    const embeds = new EmbedBuilder()
      .setColor("Aqua")
      .setTitle("Manage Api Keys")
      .setDescription(
        `The amount of api keys you are allowed to add is based on the deal you struck with the developer.
        You can create a new api key [here](https://www.torn.com/preferences.php#tab=api).
        
        Please remember
        *1. We make sure that every key is from a different user and only use the key for the discord server that it is inserted in.*
        *2. We handle these keys with absolute secrecy*
        *3. Anyone trying to manipulate this bot forfeits the right to use it*

        **Api Key:**
        `
      );

    users.forEach((object) => {
      embeds.addFields({
        name: `${object.user.name} [${object.user.id}]`,
        value: `Profile: [Click here!](https://www.torn.com/profiles.php?XID=${object.user.id})
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
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(server.apiKey.length >= server.apiKeyAmount),
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
