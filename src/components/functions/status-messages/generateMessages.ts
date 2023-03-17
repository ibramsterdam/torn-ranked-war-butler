import { getRandomItemFromArray } from "../../../util/randomItemFromArray";
import { getFactionFromTornApi } from "../../../util/tornApiUtil";
import { sendHospitalStatusEmbed } from "./hospitalStatusEmbed";
import { sendTravelStatusEmbed } from "./travelStatusEmbed";
import { sendAttackStatusEmbed } from "./attackStatusEmbed";
import {
  upsertUser,
  getUsersByFactionId,
  updateUser,
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
  const results: any = await getFactionFromTornApi(
    factionId,
    randomApiKeyObject.value
  );

  if (results.data.error) {
    console.log("Err in generateMessages while fetching from torn api");
    return console.log(results.data.error);
  }

  const membersListOld = await getUsersByFactionId(prisma, factionId);

  for (let i = 0; i < Object.keys(results.data.members).length; i++) {
    await updateUser(
      prisma,
      Number(Object.keys(results.data.members)[i]),
      Object.values(Object.values(results.data.members))[i],
      factionId
    );
  }

  const membersList = await getUsersByFactionId(prisma, factionId);
  const factionInfo = await getFaction(prisma, factionId);

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
  // remove channel messages

  // delete all possible messages
  await channel.bulkDelete(100, true).then(() => {
    console.log(
      "Messages deleted from channel:",
      channel.name,
      " of guild: ",
      channel.guild.name
    );
  });

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
