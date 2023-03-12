import {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export async function execute(interaction: any, client: any) {
  const modal: any = new ModalBuilder()
    .setCustomId("remove-faction-modal")
    .setTitle("Remove a faction");

  const textInput = new TextInputBuilder()
    .setCustomId("remove-faction-text-input")
    .setLabel("Please paste the torn id of the faction")
    .setRequired(true)
    .setMaxLength(16)
    .setStyle(TextInputStyle.Short);

  modal.addComponents(new ActionRowBuilder().addComponents(textInput));
  await interaction.showModal(modal);
}

export const developer = false;
export const data = { name: "dashboard-remove-faction" };
