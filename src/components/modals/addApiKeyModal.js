const { getUserFromTornApi } = require("../../util/tornApiUtil");
const { getDashboardButtons } = require("../functions/getDashboardButtons");

const {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");
const { getDiscordServer } = require("../../functions/prisma/discord");
const { upsertFaction } = require("../../functions/prisma/faction");
const { upsertUserAndConnectFaction } = require("../../functions/prisma/user");
const {
  createApiKey,
  getUsersThatSharedTheirApiKeyOnDiscordServer,
  getApiKeyByValue,
} = require("../../functions/prisma/apiKey");
const {
  getConnectionBetweenFactionAndDiscordServer,
} = require("../../functions/prisma/factionsOnDiscordServer");

module.exports = {
  data: { name: "add-api-key-modal" },
  async execute(interaction, client) {
    await interaction.deferReply();
    const apiKey = interaction.fields.getTextInputValue(
      "add-api-key-text-input"
    );

    // validate if apikey returns a user
    const result = await getUserFromTornApi(apiKey);
    if (result.data.error) {
      return await interaction.editReply("Not a valid key");
    }

    const guildID = Number(interaction.guildId);
    const prisma = require("../../index");
    const server = await getDiscordServer(prisma, guildID);

    // validate if the key is not already in use on the server
    if (server.apiKey.find((key) => key.value === apiKey)) {
      return await interaction.editReply(
        "Key is already connected to this server"
      );
    }

    const key = await getApiKeyByValue(prisma, apiKey);

    // prevent the key beind used twice in our system
    if (key) {
      return await interaction.editReply(
        "Key is already used in our system. If this is not supposed to be, please revoke the key on torn and reach out to the developer to remove it from the butler"
      );
    }

    const faction = await upsertFaction(
      prisma,
      result.data.faction.faction_id,
      result.data.faction.faction_name
    );

    const dbUser = await upsertUserAndConnectFaction(
      prisma,
      result.data.player_id,
      result.data.player_name,
      result.data.faction.faction_id
    );
    const dbApiKey = await createApiKey(prisma, apiKey, server.id, dbUser.id);
    const usersWhoSharedTheirKey =
      await getUsersThatSharedTheirApiKeyOnDiscordServer(prisma, guildID);

    const embeds = new EmbedBuilder()
      .setColor("Aqua")
      .setTitle("Manage Api Keys")
      .setDescription(
        `
      For every key that you add, you are allowed to add 3 factions to track. 
      You have ${
        usersWhoSharedTheirKey.length
      } api keys connected and are allowed to track ${
          usersWhoSharedTheirKey.length * 3
        } factions\n
      
      Please remember
      *1. We make sure that every key is from a different user and only use the key for the discord server that it is inserted in.*
      *2. We handle these keys with absolute secrecy*
      *3. Anyone trying to manipulate this bot forfeits the right to use it*
      `
      );

    usersWhoSharedTheirKey.forEach((object) => {
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
    );
    //Reply to the discord client
    interaction.message.delete();

    return await interaction.followUp({
      embeds: [embeds],
      components: [buttons, manageApiKeysButtons],
    });
  },
};
