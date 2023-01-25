const { getDashboardButtons } = require("../functions/getDashboardButtons");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { getDiscordServer } = require("../../functions/prisma/discord");
const {
  getConnectedFactionsOnDiscordServer,
} = require("../../functions/prisma/factionsOnDiscordServer");

module.exports = {
  developer: true,
  data: { name: "dashboard-manage-factions" },
  async execute(interaction, client) {
    interaction.message.delete();
    await interaction.deferReply();
    const prisma = require("../../index");
    const guildID = Number(interaction.guildId);

    const server = await getDiscordServer(prisma, guildID);
    const factions = await getConnectedFactionsOnDiscordServer(
      prisma,
      server.id
    );

    const manageFactionsButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("dashboard-add-faction")
        .setLabel("Add Faction ")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("dashboard-remove-faction")
        .setLabel("Remove Faction")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(server.factions.length === 0)
    );

    const embeds = new EmbedBuilder()
      .setColor("DarkAqua")
      .setTitle("Manage Factions")
      .setDescription(
        `This is not done yet and under development, so for now. Click away :)`
      )
      .addFields(
        {
          name: "Adding a faction",
          value:
            "This functionality automatically creates a channel where the bot starts messageing status updates",
          inline: true,
        },
        {
          name: "Removing a faction",
          value:
            "This functionality removes the channel connected to the faction",
          inline: true,
        }
      );

    factions.forEach((object) => {
      embeds.addFields({
        name: `${object.faction.name} [${object.faction.tornId}]`,
        value: `Profile: [Click here!](https://www.torn.com/factions.php?step=profile&ID=${object.faction.tornId})`,
      });
    });
    let buttons = await getDashboardButtons(
      "factions",
      !server.isWhitelisted,
      server.apiKey.length === 0
    );
    if (server.isWhitelisted) {
      buttons = await getDashboardButtons(
        "factions",
        !server.isWhitelisted,
        server.apiKey.length === 0
      );
    }

    //Reply to the discord client
    await interaction.followUp({
      embeds: [embeds],
      components: [buttons, manageFactionsButtons],
    });
  },
};
