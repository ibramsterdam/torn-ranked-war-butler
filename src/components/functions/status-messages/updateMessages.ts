import { getRandomItemFromArray } from "../../../util/randomItemFromArray";
import { getFactionFromTornApi } from "../../../util/tornApiUtil";
import { sendHospitalStatusEmbed } from "./hospitalStatusEmbed";
import { sendTravelStatusEmbed } from "./travelStatusEmbed";
import { sendAttackStatusEmbed } from "./attackStatusEmbed";
import {
  getUsersByFactionId,
  upsertUserNoLink,
} from "../../../functions/prisma/user";
import { getFaction } from "../../../functions/prisma/faction";
import { sendRetalliationStatusEmbed } from "./retalliationStatusEmbed";
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function updateMessages(
  factionId: number,
  server: any,
  prisma: any,
  oldMessages: any
) {
  let faction = await getFactionFromTornApi(
    factionId,
    getRandomItemFromArray(server.apiKeys).value
  );

  while (!faction) {
    console.log("Err in updateMessages while fetching from torn api");
    console.log("Retrying...");
    await delay(2000);
    faction = await getFactionFromTornApi(
      factionId,
      getRandomItemFromArray(server.apiKeys).value
    );
  }

  const membersListOld = await getUsersByFactionId(prisma, factionId);

  for (let i = 0; i < faction.members.length; i++) {
    await upsertUserNoLink(prisma, faction.members[i], factionId);
  }

  const membersList = await getUsersByFactionId(prisma, factionId);
  const factionInfo = await getFaction(prisma, factionId);

  const hospResponses = await sendHospitalStatusEmbed(membersList, factionInfo);
  const travelResponses = await sendTravelStatusEmbed(membersList, factionInfo);
  const attackResponses = await sendAttackStatusEmbed(membersList, factionInfo);
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
    }
    index++;
  }
  if (error)
    return console.log("Error in updateMessages and thus cancelling updates");
  await delay(10000);
  updateMessages(factionId, server, prisma, messageArray);
}
