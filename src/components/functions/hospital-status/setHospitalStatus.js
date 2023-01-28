const { getRandomItemFromArray } = require("../../../util/randomItemFromArray");
const { getFactionFromTornApi } = require("../../../util/tornApiUtil");
const { sendHospitalStatusEmbed } = require("./hospitalStatusEmbed");

async function setHospitalStatus(interaction, server) {
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
}

module.exports = { setHospitalStatus };
