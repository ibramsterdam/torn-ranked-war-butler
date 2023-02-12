const { EmbedBuilder } = require("discord.js");
const {
  updateUserRetalliationTimer,
  getUsersThatCanBeRetalliatedFromFaction,
} = require("../../../functions/prisma/user");

function getNewMembersInHospital(list1, list2) {
  return list2.filter((obj2) => {
    return !list1.some((obj1) => {
      return obj1.id === obj2.id;
    });
  });
}

async function sendRetalliationStatusEmbed(
  interaction,
  membersListOld,
  membersListNew,
  faction,
  factionInfo
) {
  const prisma = require("../../../index");
  const filteredMembersListOld = membersListOld.filter(
    (member) => member.statusState === "Hospital"
  );
  const filteredMembersListNew = membersListNew.filter(
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
    faction.factionId
  );

  let retalliationMessageList = [];
  const response = new EmbedBuilder().setColor("Yellow");
  const sortedRetalliationList = users.filter(
    (member) => member.retalliationUntil > new Date()
  );

  if (sortedRetalliationList.length === 0) {
    response.setTitle(`🥷  Retalliation List of ${factionInfo.name} 🥷 `);
    response.setDescription(
      `List was requested <t:${Math.round(Date.now() / 1000)}:R>.
  
        **Retalliation List**: 0 members`
    );

    return await interaction.guild.channels.cache
      .get(faction.discordChannelId.toString())
      .send({
        embeds: [response],
      });
  }

  // Create the message list
  sortedRetalliationList.forEach((member) => {
    retalliationMessageList.push(
      `**[${member.name}](https://www.torn.com/profiles.php?XID=${member.id})** is ${member.statusDetails} \n`
    );
  });

  for (let i = 0; i < sortedRetalliationList.length; i += 20) {
    response.setTitle(`🥷  Retalliation List of ${factionInfo.name} 🥷 `);
    response.setDescription(
      `List was requested <t:${Math.round(Date.now() / 1000)}:R>.
        
        **Retalliation List**: (**${retalliationMessageList.length} / ${
        membersListNew.length
      }** members in hospital)
        
        **${i}-${i + 20}**
        ${retalliationMessageList.slice(i, i + 20).join("")}`
    );
    if (i > 0) {
      response.setTitle(`${i}-${i + 20}`);
      response.setDescription(
        `
        ${retalliationMessageList.slice(i, i + 20).join("")}`
      );
    }
    await interaction.guild.channels.cache
      .get(faction.discordChannelId.toString())
      .send({
        embeds: [response],
      });
  }
}

module.exports = { sendRetalliationStatusEmbed };
