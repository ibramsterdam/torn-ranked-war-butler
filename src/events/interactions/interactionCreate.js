const { ChatInputCommandInteraction, Client } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *  @param {ChatInputCommandInteraction} interaction
   *  @param {Client} client
   */
  async execute(interaction, client) {
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
  },
};
