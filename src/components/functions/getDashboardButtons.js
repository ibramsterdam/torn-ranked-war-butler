const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

async function getDashboardButtons(menuType, isNotWhitelisted, hasNoApiKey) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("dashboard-manage-api-keys")
      .setLabel("Manage Api Keys")
      .setStyle(menuType === "keys" ? ButtonStyle.Success : ButtonStyle.Primary)
      .setDisabled(isNotWhitelisted || menuType === "keys"),
    new ButtonBuilder()
      .setCustomId("dashboard-manage-factions")
      .setLabel("Manage Factions")
      .setStyle(
        menuType === "factions" ? ButtonStyle.Success : ButtonStyle.Primary
      )
      .setDisabled(menuType === "factions" || isNotWhitelisted || hasNoApiKey)
  );
}

module.exports = { getDashboardButtons };
