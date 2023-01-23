const { getUser } = require("../../util/tornApiUtil");
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
  upsertApiKey,
  getUsersThatSharedTheirApiKeyOnDiscordServer,
} = require("../../functions/prisma/apiKey");

module.exports = {
  data: { name: "add-api-key-modal" },
  async execute(interaction, client) {
    await interaction.deferReply();
    const apiKey = interaction.fields.getTextInputValue(
      "add-api-key-text-input"
    );

    // validate if apikey returns a user
    const user = await getUser(apiKey);
    if (user.data.error) {
      return await interaction.editReply("Not a valid key");
    }

    const guildID = Number(interaction.guildId);
    const prisma = require("../../index");
    const server = await getDiscordServer(prisma, guildID);
    const faction = await upsertFaction(prisma, user.data.faction);
    const dbUser = await upsertUserAndConnectFaction(user.data, prisma);
    const dbApiKey = await upsertApiKey(prisma, apiKey, server, dbUser);
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
      false
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
