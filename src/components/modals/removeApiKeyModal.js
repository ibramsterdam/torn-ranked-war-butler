const { getUser } = require("../../util/tornApiUtil");
const { getDashboardButtons } = require("../functions/getDashboardButtons");

const {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: { name: "remove-api-key-modal" },
  async execute(interaction, client) {
    await interaction.deferReply();
    const tornIdOfUser = interaction.fields.getTextInputValue(
      "remove-api-key-text-input"
    );

    // validate if apikey returns a user
    if (!/^\d+$/.test(tornIdOfUser)) {
      return await interaction.editReply("Torn Id is composed of numbers...");
    }

    const guildID = Number(interaction.guildId);
    const prisma = require("../../index");

    try {
      const user = await prisma.user.findUnique({
        where: {
          tornId: Number(tornIdOfUser),
        },
      });
      const apiKey = await prisma.apiKey.delete({
        where: {
          userId: user.id,
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
      const buttons = await getDashboardButtons("keys");

      const manageApiKeysButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("dashboard-set-api-key")
          .setLabel("Set Api Key")
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
