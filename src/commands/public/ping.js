const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  execute(interaction) {
    interaction.reply({ content: "Pong!!!", ephemeral: true });
  },
};
