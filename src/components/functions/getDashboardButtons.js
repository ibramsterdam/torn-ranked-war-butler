const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

async function getDashboardButtons() {
  const buttonRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("dashboard-manage-api-keys")
      .setLabel("Manage Api Keys")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("dashboard-manage-factions")
      .setLabel("Manage Factions")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("dashboard-manage-channels")
      .setLabel("Configure Channels")
      .setStyle(ButtonStyle.Primary)
  );
  const buttonRow2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("dashboard-close-dashboard-button")
      .setLabel("Close Dashboard")
      .setStyle(ButtonStyle.Danger)
  );

  return [buttonRow, buttonRow2];
}

module.exports = { getDashboardButtons };
