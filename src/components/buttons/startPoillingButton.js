const { getDiscordServer } = require("../../functions/prisma/discord");
const { fetchStatus } = require("../functions/status-messages/fetchStatus");

module.exports = {
  developer: false,
  data: { name: "dashboard-start-polling" },
  async execute(interaction, client) {
    await interaction.reply("Started Polling");
    const guildID = BigInt(interaction.guildId);
    const prisma = require("../../index");
    const server = await getDiscordServer(prisma, guildID);

    fetchStatus(interaction, server);

    // Run everything again at a 30 second interval
    setInterval(async () => {
      fetchStatus(interaction, server);
    }, 30000);
  },
};
