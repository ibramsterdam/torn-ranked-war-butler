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
const { updateMessages } = require("./updateMessages");
const { sendReviveStatusEmbed } = require("./reviveStatusEmbed");

async function generateMessages(interaction, faction, server, prisma) {
  // Select a random ApiKey from the list
  const randomApiKeyObject = getRandomItemFromArray(server.apiKeys);

  // fetch faction information
  const results = await getFactionFromTornApi(
    faction.factionId,
    randomApiKeyObject.value
  );

  if (results.data.error) {
    console.log("Err in generateMessages while fetching from torn api");
    return console.log(results.data.error);
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
  // Revive status
  const reviveResponse = await sendReviveStatusEmbed(membersList, factionInfo);
  // remove channel messages
  const channel = await interaction.guild.channels.cache.get(
    faction.discordChannelId.toString()
  );

  if (!channel) {
    console.log(
      "NO channel found that matches: ",
      faction.discordChannelId.toString()
    );
    return;
  }

  // delete all possible messages
  await channel.bulkDelete(100, true).then(() => {
    console.log("Messages deleted");
  });

  let messageArray = [];

  for (const response of [
    ...hospResponses,
    ...travelResponses,
    ...attackResponses,
    ...retalliationResponse,
    ...reviveResponse,
  ]) {
    try {
      const message = await channel.send({
        embeds: [response],
      });
      messageArray.push(message);
    } catch (error) {
      console.log("generateMessages try catch err");
    }
  }

  setInterval(async () => {
    updateMessages(interaction, faction, server, prisma, messageArray);
  }, 10000);
}
module.exports = { generateMessages };
