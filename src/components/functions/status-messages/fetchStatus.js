const { getRandomItemFromArray } = require("../../../util/randomItemFromArray");
const { getFactionFromTornApi } = require("../../../util/tornApiUtil");
const { sendHospitalStatusEmbed } = require("./hospitalStatusEmbed");
const { sendTravelStatusEmbed } = require("./travelStatusEmbed");
const { sendAttackStatusEmbed } = require("./attackStatusEmbed");
const { EmbedBuilder } = require("discord.js");
const {
  upsertUser,
  getUsersByFactionId,
} = require("../../../functions/prisma/user");
const { getFaction } = require("../../../functions/prisma/faction");

async function fetchStatus(interaction, server) {
  const prisma = require("../../../index");

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

    const membersListOld = await getUsersByFactionId(prisma, faction.factionId);

    const memberList = Object.values(Object.values(results.data.members));
    const memberIdList = Object.keys(results.data.members);

    for (let i = 0; i < memberIdList.length; i++) {
      await upsertUser(
        prisma,
        Number(memberIdList[i]),
        memberList[i],
        faction.factionId
      );
    }

    const membersListNew = await getUsersByFactionId(prisma, faction.factionId);
    const factionInfo = await getFaction(prisma, faction.factionId);

    // Hosp status
    await sendHospitalStatusEmbed(
      interaction,
      membersListNew,
      faction,
      factionInfo
    );

    // Okay status
    await sendTravelStatusEmbed(interaction, results, faction);

    // Flight status
    await sendAttackStatusEmbed(interaction, results, faction);

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

module.exports = { fetchStatus };
