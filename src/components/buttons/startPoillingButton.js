const { getDiscordServer } = require("../../functions/prisma/discord");
const { getRandomItemFromArray } = require("../../util/randomItemFromArray");
const { getFactionFromTornApi } = require("../../util/tornApiUtil");
const {
  sendHospitalStatusEmbed,
} = require("../functions/hospital-status/hospitalStatusEmbed");
const {
  setHospitalStatus,
} = require("../functions/hospital-status/setHospitalStatus");

module.exports = {
  developer: false,
  data: { name: "dashboard-start-polling" },
  async execute(interaction, client) {
    await interaction.reply("Started Polling");
    const guildID = BigInt(interaction.guildId);
    const prisma = require("../../index");
    const server = await getDiscordServer(prisma, guildID);

    // Hospital status
    setHospitalStatus(interaction, server);

    // Run everything again at a 2 minute interval
    setInterval(async () => {
      setHospitalStatus(interaction, server);
    }, 15000);

    /*
     * 1. Load api keys
     * 2. do everything in a trycatch
     * 3. load factions and their respective channelID's
     * 4. do everything in a setInterval and
     * 5. remove the previous messages
     */
  },
};

function wait(ms) {
  var start = Date.now(),
    now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}
