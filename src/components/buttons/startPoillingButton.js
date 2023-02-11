const { getDiscordServer } = require("../../functions/prisma/discord");
const { getRandomItemFromArray } = require("../../util/randomItemFromArray");
const { getFactionFromTornApi } = require("../../util/tornApiUtil");
const {
  sendHospitalStatusEmbed,
} = require("../functions/status-messages/hospitalStatusEmbed");
const { fetchStatus } = require("../functions/status-messages/fetchStatus");

module.exports = {
  developer: false,
  data: { name: "dashboard-start-polling" },
  async execute(interaction, client) {
    await interaction.reply("Started Polling");
    const guildID = BigInt(interaction.guildId);
    const prisma = require("../../index");
    const server = await getDiscordServer(prisma, guildID);

    // Hospital status
    fetchStatus(interaction, server);

    // Run everything again at a 2 minute interval
    setInterval(async () => {
      fetchStatus(interaction, server);
    }, 20000);

    /*
     * 1. Load api keys
     * 2. do everything in a trycatch
     * 3. load factions and their respective channelID's
     * 4. do everything in a setInterval and
     * 5. remove the previous messages
     */
  },
};
