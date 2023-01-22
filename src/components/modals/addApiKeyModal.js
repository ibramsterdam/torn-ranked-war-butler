const { getUser } = require("../../util/tornApiUtil");
const { getDashboardButtons } = require("../functions/getDashboardButtons");

const {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");

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

      const users = await prisma.apiKey.findMany({
        where: {
          discordServer: {
            guildId: guildID,
          },
        },
        select: {
          user: {
            include: {
              faction: true,
            },
          },
        },
      });

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
        !dbDiscordServer.isWhitelisted,
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
    } catch (error) {
      console.log("Err while working with prisma", error);
    }

    await interaction.editReply({
      content: `something went wrong`,
    });
  },
};
