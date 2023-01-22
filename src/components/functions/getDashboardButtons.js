const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

async function getDashboardButtons(activeButton) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("dashboard-manage-api-keys")
      .setLabel("Manage Api Keys")
      .setStyle(
        activeButton === "keys" ? ButtonStyle.Success : ButtonStyle.Primary
      )
      .setDisabled(activeButton === "keys" || activeButton === "none"),
    new ButtonBuilder()
      .setCustomId("dashboard-manage-factions")
      .setLabel("Manage Factions")
      .setStyle(
        activeButton === "factions" ? ButtonStyle.Success : ButtonStyle.Primary
      )
      .setDisabled(activeButton === "factions" || activeButton === "none"),
    new ButtonBuilder()
      .setCustomId("dashboard-close-dashboard-button")
      .setLabel("Close Dashboard")
      .setStyle(ButtonStyle.Danger)
  );
}

module.exports = { getDashboardButtons };
