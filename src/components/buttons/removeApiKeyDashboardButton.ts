import {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export async function execute(interaction: any, client: any) {
  const modal: any = new ModalBuilder()
    .setCustomId("remove-api-key-modal")
    .setTitle("Remove your api key");

  const textInput = new TextInputBuilder()
    .setCustomId("remove-api-key-text-input")
    .setLabel("Please paste the torn id of the user")
    .setRequired(true)
    .setMaxLength(16)
    .setStyle(TextInputStyle.Short);

  modal.addComponents(new ActionRowBuilder().addComponents(textInput));
  await interaction.showModal(modal);
}

export const data = { name: "dashboard-remove-api-key" };
export const developer = false;
