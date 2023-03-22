import {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  APIActionRowComponent,
  APIMessageActionRowComponent,
} from "discord.js";

export async function getDashboardButtons(
  menuType: any,
  isNotWhitelisted: boolean,
  hasNoApiKey: boolean,
  hasNoFactions: boolean
) {
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
    // new ButtonBuilder()
    //   .setCustomId("dashboard-start-polling")
    //   .setLabel("Get me that faction info!")
    //   .setStyle(ButtonStyle.Danger)
    //   .setDisabled(hasNoFactions || isNotWhitelisted)
  ) as any;
}
