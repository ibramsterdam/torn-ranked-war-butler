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
import { updateMessages } from "./updateMessages";
import { PrismaClient } from "@prisma/client";
import { TextChannel } from "discord.js";

export async function generateMessages(
  channel: TextChannel,
  factionId: number,
  server: any,
  prisma: PrismaClient
) {
  // Select a random ApiKey from the list
  const randomApiKeyObject = getRandomItemFromArray(server.apiKeys);

  // fetch faction information
  const faction = await getFactionFromTornApi(
    factionId,
    randomApiKeyObject.value
  );

  if (!faction) {
    return console.log("Err in generateMessages while fetching from torn api");
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
  // remove channel messages

  await channel.bulkDelete(100, true).then(() => {});
  let messageArray = [];

  for (const response of [
    ...hospResponses,
    ...attackResponses,
    ...travelResponses,
    ...retalliationResponse,
    // ...reviveResponse,
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

  updateMessages(factionId, server, prisma, messageArray);
}
