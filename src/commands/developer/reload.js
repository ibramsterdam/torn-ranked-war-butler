const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { handleEvents } = require("../../functions/handlers/eventHandler");
const { handleCommands } = require("../../functions/handlers/commandHandler");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload your commands/events")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((options) =>
      options.setName("events").setDescription("Reload your events")
    )
    .addSubcommand((options) =>
      options.setName("commands").setDescription("Reload your commands")
    ),
  execute(interaction, client) {
    const subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
      case "events":
        {
          for (const [key, value] of client.events) {
            client.removeListener(`${key}`, value, true);
            handleEvents(client);
            interaction.reply({ content: "Reloaded Events", ephemeral: true });
          }
        }
        break;
      case "commands":
        {
          handleCommands(client);
          interaction.reply({ content: "Reloaded Commands", ephemeral: true });
        }
        break;
    }
  },
};
