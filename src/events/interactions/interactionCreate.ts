// @ts-nocheck

import {
  ChatInputCommandInteraction,
  Client,
  InteractionType,
} from "discord.js";

module.exports = {
  name: "interactionCreate",
  async execute(interaction: ChatInputCommandInteraction, client: Client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) {
        return interaction.reply({
          content: "This command is outdated.",
          ephemeral: true,
        });
      }
      if (command.developer && interaction.user.id !== "125402917678219264")
        return interaction.reply({
          content: "This command is only available to the developer",
          ephemeral: true,
        });

      command.execute(interaction, client);
    }

    if (interaction.isButton()) {
      const { buttons } = client;
      const { customId } = interaction;
      const button = buttons.get(customId);

      if (button.developer && interaction.user.id !== "125402917678219264")
        return interaction.reply({
          content:
            "This command is under development and thus only available to the developer",
          ephemeral: true,
        });

      if (!button) return new Error("There is no code for this button");

      try {
        await button.execute(interaction, client);
      } catch (err) {
        console.error(err);
      }
    }
    if (interaction.isStringSelectMenu()) {
      const { selectMenus } = client;
      const { customId } = interaction;
      const menu = selectMenus.get(customId);

      if (!menu) return new Error("There is no code for this menu");

      try {
        await menu.execute(interaction, client);
      } catch (err) {
        console.error(err);
      }
    }
    if (interaction.type == InteractionType.ModalSubmit) {
      const { modals } = client;
      const { customId } = interaction;
      const modal = modals.get(customId);

      if (!modal) return new Error("There is no code for this modal");

      try {
        await modal.execute(interaction, client);
      } catch (err) {
        console.error(err);
      }
    }
  },
};
