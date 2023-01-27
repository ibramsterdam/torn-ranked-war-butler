const { getDiscordServer } = require("../../functions/prisma/discord");
const { getRandomItemFromArray } = require("../../util/randomItemFromArray");
const { getFactionFromTornApi } = require("../../util/tornApiUtil");
const { sendHospitalStatusEmbed } = require("../functions/hospitalStatusEmbed");

module.exports = {
  developer: false,
  data: { name: "dashboard-start-polling" },
  async execute(interaction, client) {
    await interaction.reply("Started Polling");
    const guildID = BigInt(interaction.guildId);
    const prisma = require("../../index");
    const server = await getDiscordServer(prisma, guildID);

    setInterval(async () => {
      // Hospital status
      for (const faction of server.factions) {
        // Select a random ApiKey from the list
        const randomApiKeyObject = getRandomItemFromArray(server.apiKeys);
        // remove channel messages
        const channel = await interaction.guild.channels.cache.get(
          faction.discordChannelId.toString()
        );
        const messages = await channel.messages.fetch();
        await channel.bulkDelete(messages);

        // fetch faction information
        const results = await getFactionFromTornApi(
          faction.factionId,
          randomApiKeyObject.value
        );

        await sendHospitalStatusEmbed(interaction, results, faction);

        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }, 60000);

    /*
     * 1. load api keys
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
