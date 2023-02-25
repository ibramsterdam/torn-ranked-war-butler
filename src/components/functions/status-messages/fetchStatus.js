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
const { sendRetalliationStatusEmbed } = require("./retalliationStatusEmbed");

async function fetchStatus(interaction, server) {
  const prisma = require("../../../index");

  for (const faction of server.factions) {
    const result = await generateMessages(interaction, faction, server, prisma);
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}
async function generateMessages(interaction, faction, server, prisma) {
  // Select a random ApiKey from the list
  const randomApiKeyObject = getRandomItemFromArray(server.apiKeys);

  // fetch faction information
  const results = await getFactionFromTornApi(
    faction.factionId,
    randomApiKeyObject.value
  );

  if (results.data.error) {
    console.log(results.data.error);
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

  for (let i = 0; i < Object.keys(results.data.members).length; i++) {
    await upsertUser(
      prisma,
      Number(Object.keys(results.data.members)[i]),
      Object.values(Object.values(results.data.members))[i],
      faction.factionId
    );
  }

  const membersList = await getUsersByFactionId(prisma, faction.factionId);
  const factionInfo = await getFaction(prisma, faction.factionId);

  // Hosp status
  const hospResponses = await sendHospitalStatusEmbed(membersList, factionInfo);

  // Travel status
  const travelResponses = await sendTravelStatusEmbed(membersList, factionInfo);

  // Flight status
  const attackResponses = await sendAttackStatusEmbed(membersList, factionInfo);

  // Retalliation status
  const retalliationResponse = await sendRetalliationStatusEmbed(
    membersListOld,
    membersList,
    factionInfo
  );

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

  for (const response of hospResponses) {
    await interaction.guild.channels.cache
      .get(faction.discordChannelId.toString())
      .send({
        embeds: [response],
      });
  }

  for (const response of travelResponses) {
    await interaction.guild.channels.cache
      .get(faction.discordChannelId.toString())
      .send({
        embeds: [response],
      });
  }
  for (const response of attackResponses) {
    await interaction.guild.channels.cache
      .get(faction.discordChannelId.toString())
      .send({
        embeds: [response],
      });
  }
  for (const response of retalliationResponse) {
    await interaction.guild.channels.cache
      .get(faction.discordChannelId.toString())
      .send({
        embeds: [response],
      });
  }
  return factionInfo;
}
module.exports = { fetchStatus };
