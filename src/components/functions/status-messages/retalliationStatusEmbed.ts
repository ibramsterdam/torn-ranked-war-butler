import { EmbedBuilder } from "discord.js";
import {
  updateUserRetalliationTimer,
  getUsersThatCanBeRetalliatedFromFaction,
} from "../../../functions/prisma/user";
import { prisma } from "../../../index";

function getNewMembersInHospital(list1: any, list2: any) {
  return list2?.filter((obj2: any) => {
    return !list1.some((obj1: any) => {
      return obj1.id === obj2.id;
    });
  });
}

export async function sendRetalliationStatusEmbed(
  membersListOld: any,
  membersListNew: any,
  factionInfo: any
) {
  const filteredMembersListOld = membersListOld?.filter(
    (member: any) => member.statusState === "Hospital"
  );
  const filteredMembersListNew = membersListNew?.filter(
    (member: any) => member.statusState === "Hospital"
  );
  //  check if there are new retallliations (compare old to new)
  const newMembersInHospital = getNewMembersInHospital(
    filteredMembersListOld,
    filteredMembersListNew
  );

  // 2. update retalliation list and fetch the list of retalliatable users from faction

  for (let i = 0; i < newMembersInHospital.length; i++) {
    await updateUserRetalliationTimer(prisma, newMembersInHospital[i].id);
  }

  const users: any = await getUsersThatCanBeRetalliatedFromFaction(
    prisma,
    factionInfo.id
  );

  let retalliationMessageList: any = [];
  const sortedRetalliationList = users.filter(
    (member: any) => member.retalliationUntil > new Date()
  );

  // Create the message list
  sortedRetalliationList.forEach((member: any) => {
    const regexLink = /href\s*=\s*"([^"]+)"/;
    const regexName = />(.*?)</;
    const regexID = /=(\d+)/;

    const link = member.statusDetails.match(regexLink)[1];
    const name = member.statusDetails.match(regexName)[1];
    const attackID = member.statusDetails.match(regexID)[1];

    retalliationMessageList.push(
      `**[${member.name}](${
        member.profileLink
      })** is hospitalized by [${name}](${link})
      Retalliation timer ends: <t:${Math.round(
        member.retalliationUntil.valueOf() / 1000
      )}:R> • [Attack!](${member.attackLink})\n
      `
    );
  });

  const response = new EmbedBuilder().setColor("Yellow");
  response.setTitle(`🥷  Retalliation List of ${factionInfo.name} 🥷 `);
  response.setDescription(
    `List was updated <t:${Math.round(Date.now() / 1000)}:R>.
        
    ${retalliationMessageList}`
  );

  return [response];
}
