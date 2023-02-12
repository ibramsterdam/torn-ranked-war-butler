const { EmbedBuilder } = require("discord.js");

function getNewObjects(list1, list2) {
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
  const filteredMembersListOld = membersListOld.filter(
    (member) => member.statusState === "Hospital"
  );
  const filteredMembersListNew = membersListNew.filter(
    (member) => member.statusState === "Hospital"
  );
  // 1. check if there are new retallliations (compare old to new)
  console.log(
    membersListOld.filter((member) => member.statusState === "Hospital").length
  );
  console.log(
    membersListNew.filter((member) => member.statusState === "Hospital").length
  );
  console.log(getNewObjects(filteredMembersListOld, filteredMembersListNew));
  // 2. update retalliation list and fetch the list of retalliatable users from faction
  let retalliationMessageList = [];
  const response = new EmbedBuilder().setColor("Yellow");
  const sortedRetalliationList = membersListNew.filter(
    (member) => member.retalliationUntil > Date.now()
  );

  console.log("sortedRetalliationList");
  console.log(sortedRetalliationList);

  return;
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
      `**[${member.name}](https://www.torn.com/profiles.php?XID=${
        member.id
      })** is ${member.lastActionStatus.toLowerCase()} ${
        member.lastActionRelative
      } • [Attack!](https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${
        member.id
      }) \n`
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
