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
const { sendReviveStatusEmbed } = require("./reviveStatusEmbed");
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function updateMessages(
  interaction,
  faction,
  server,
  prisma,
  oldMessages
) {
  // Select a random ApiKey from the list
  let randomApiKeyObject = getRandomItemFromArray(server.apiKeys);

  // fetch faction information
  let results = await getFactionFromTornApi(
    faction.factionId,
    randomApiKeyObject.value
  );

  while (results.data.error) {
    console.log(
      "Err in updateMessages while fetching from torn api",
      results.data.error
    );
    console.log("Retrying...");
    await delay(2000);
    randomApiKeyObject = getRandomItemFromArray(server.apiKeys);
    results = await getFactionFromTornApi(
      faction.factionId,
      randomApiKeyObject.value
    );
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
  // const reviveResponse = await sendReviveStatusEmbed(membersList, factionInfo);

  let index = 0;
  let messageArray = [];
  let error = false;
  for (const response of [
    ...hospResponses,
    ...attackResponses,
    ...travelResponses,
    ...retalliationResponse,
    // ...reviveResponse,
  ]) {
    try {
      const message = await oldMessages[index].edit({ embeds: [response] });
      messageArray.push(message);
    } catch (err) {
      error = true;
      console.log("Error in updateMessages");
      console.log("Index error:", index);
      // console.log("oldmessagesArr", oldMessages);
    }
    index++;
  }
  if (error) return console.log("Error and thus cancelling updates");
  await delay(10000);
  updateMessages(interaction, faction, server, prisma, messageArray);
}
module.exports = { updateMessages };
