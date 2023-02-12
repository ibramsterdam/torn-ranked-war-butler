const { getRandomItemFromArray } = require("../../../util/randomItemFromArray");
const { getFactionFromTornApi } = require("../../../util/tornApiUtil");
const { sendHospitalStatusEmbed } = require("./hospitalStatusEmbed");
const { sendTravelStatusEmbed } = require("./travelStatusEmbed");
const { sendAttackStatusEmbed } = require("./attackStatusEmbed");
const { EmbedBuilder } = require("discord.js");

async function fetchStatus(interaction, server) {
  for (const faction of server.factions) {
    // Select a random ApiKey from the list
    const randomApiKeyObject = getRandomItemFromArray(server.apiKeys);
    // remove channel messages
    const channel = await interaction.guild.channels.cache.get(
      faction.discordChannelId.toString()
    );

    if (channel) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const messages = await channel.messages.fetch();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (messages) {
        await channel.bulkDelete(messages);
      }
    }

    // fetch faction information
    const results = await getFactionFromTornApi(
      faction.factionId,
      randomApiKeyObject.value
    );

    if (results.data.error) {
      const err = new EmbedBuilder()
        .setColor("Aqua")
        .setTitle(`No faction found :(`);
      return await interaction.guild.channels.cache
        .get(faction.discordChannelId.toString())
        .send({
          embeds: [err],
        });
    }

    // Hosp status
    await sendHospitalStatusEmbed(interaction, results, faction);

    // Okay status
    await sendTravelStatusEmbed(interaction, results, faction);

    // Flight status
    await sendAttackStatusEmbed(interaction, results, faction);

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

module.exports = { fetchStatus };
