/*global ChatInputCommandInteraction */

const { ChatInputCommandInteraction, Client } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *  @param {ChatInputCommandInteraction} interaction
   *  @param {Client} client
   */
  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

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
  },
};
