const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { getDashboardButtons } = require("../functions/getDashboardButtons");

module.exports = {
  data: { name: "dashboard-manage-api-keys" },
  async execute(interaction, client) {
    await interaction.deferReply();
    await interaction.message.delete();
    const prisma = require("../../index");
    const guildID = Number(interaction.guildId);
    let users;

    try {
      users = await prisma.apiKey.findMany({
        where: {
          discordServer: {
            guildId: guildID,
          },
        },
        include: {
          user: true,
        },
      });
      console.log(users);
    } catch (error) {
      console.log(error);
    }

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
      )
      .addFields({
        name: "Users are sharing their key",
        value: ``,
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
    await interaction.followUp({
      embeds: [embeds],
      components: [buttons, manageApiKeysButtons],
    });
  },
};
