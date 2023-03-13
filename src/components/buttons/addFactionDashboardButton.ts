import {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export async function execute(interaction: any, client: any) {
  const modal: any = new ModalBuilder()
    .setCustomId("add-faction-modal")
    .setTitle("Add a Faction");

  const textInput = new TextInputBuilder()
    .setCustomId("add-faction-text-input")
    .setLabel("Please paste the torn id of the faction")
    .setRequired(true)
    .setMaxLength(16)
    .setStyle(TextInputStyle.Short);

  modal.addComponents(new ActionRowBuilder().addComponents(textInput));
  await interaction.showModal(modal);
}

export const data = { name: "dashboard-add-faction" };
export const developer = false;
