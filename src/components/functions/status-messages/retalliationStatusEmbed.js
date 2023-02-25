const { EmbedBuilder } = require("discord.js");
const {
  updateUserRetalliationTimer,
  getUsersThatCanBeRetalliatedFromFaction,
} = require("../../../functions/prisma/user");

function getNewMembersInHospital(list1, list2) {
  return list2?.filter((obj2) => {
    return !list1.some((obj1) => {
      return obj1.id === obj2.id;
    });
  });
}

async function sendRetalliationStatusEmbed(
  membersListOld,
  membersListNew,
  factionInfo
) {
  const prisma = require("../../../index");
  const filteredMembersListOld = membersListOld?.filter(
    (member) => member.statusState === "Hospital"
  );
  const filteredMembersListNew = membersListNew?.filter(
    (member) => member.statusState === "Hospital"
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

  const users = await getUsersThatCanBeRetalliatedFromFaction(
    prisma,
    factionInfo.id
  );

  let retalliationMessageList = [];
  const sortedRetalliationList = users.filter(
    (member) => member.retalliationUntil > new Date()
  );

  // Create the message list
  sortedRetalliationList.forEach((member) => {
    const regexLink = /href\s*=\s*"([^"]+)"/;
    const regexName = />(.*?)</;
    const regexID = /=(\d+)/;

    const link = member.statusDetails.match(regexLink)[1];
    const name = member.statusDetails.match(regexName)[1];
    const attackID = member.statusDetails.match(regexID)[1];

    retalliationMessageList.push(
      `**[${member.name}](https://www.torn.com/profiles.php?XID=${
        member.id
      })** is hospitalized by [${name}](${link})
      Retalliation timer ends: <t:${Math.round(
        member.retalliationUntil.valueOf() / 1000
      )}:R> • [Attack!](https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${attackID})\n
      `
    );
  });

  const responseList = [];

  for (let i = 0; i < membersListNew.length; i += 21) {
    const response = new EmbedBuilder().setColor("Yellow");
    const list = retalliationMessageList.slice(i, i + 20).join("");

    response.setTitle(`🥷  Retalliation List of ${factionInfo.name} 🥷 `);
    response.setDescription(
      `List was updated <t:${Math.round(Date.now() / 1000)}:R>.
        
        **Retalliation List**: (**${retalliationMessageList.length} / ${
        membersListNew.length
      })** members
        
        **${i}-${i + 20} members**
        ${list}`
    );
    if (i > 0) {
      if (i > 80) i = 80;
      response.setTitle(`${i}-${i + 20} members`);
      response.setDescription(
        `
        ${list}`
      );
    }
    responseList.push(response);
  }

  return responseList;
}

module.exports = { sendRetalliationStatusEmbed };
