const {
  SlashCommandBuilder,
  CommandInteraction,
  Client,
} = require("discord.js");
const { getDiscordServer } = require("../functions/prisma/discord.ts");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("delete-messages")
    .setDescription("Batch deletes messages (developer only)"),
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.reply("Deleting...");
    setTimeout(async () => await interaction.deleteReply(), 5000);

    const guildID = BigInt(interaction.guildId);
    const prisma = require("../index");
    const server = await getDiscordServer(prisma, guildID);

    for (const faction of server.factions) {
      const channel = await interaction.guild.channels.cache.get(
        faction.discordChannelId.toString()
      );

      // delete all possible messages
      await channel.bulkDelete(100, true).then(() => {
        console.log(
          "Messages deleted of ",
          faction.discordChannelId.toString()
        );
      });
    }
  },
};
