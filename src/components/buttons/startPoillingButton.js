const { getDiscordServer } = require("../../functions/prisma/discord.ts");
const {
  generateMessages,
} = require("../functions/status-messages/generateMessages");

module.exports = {
  developer: false,
  data: { name: "dashboard-start-polling" },
  async execute(interaction, client) {
    await interaction.reply("Started Polling");
    setTimeout(async () => await interaction.deleteReply(), 5000);

    const guildID = BigInt(interaction.guildId);
    const prisma = require("../../index");
    const server = await getDiscordServer(prisma, guildID);

    for (const faction of server.factions) {
      await generateMessages(interaction, faction, server, prisma);
    }
  },
};
