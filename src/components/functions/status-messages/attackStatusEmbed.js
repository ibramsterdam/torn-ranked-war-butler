const { EmbedBuilder } = require("discord.js");

async function sendAttackStatusEmbed(membersListNew, factionInfo) {
  let attackMessageList = [];
  const sortedAttackList = membersListNew
    .filter((member) => member.statusState === "Okay")
    .sort(
      (a, b) => Number(a.lastActionTimestamp) - Number(b.lastActionTimestamp)
    );

  if (sortedAttackList.length === 0) {
    const noMemberResponse = new EmbedBuilder().setColor("Green");

    noMemberResponse.setTitle(`🔫  Attack List of ${factionInfo.name} 🔫 `);
    noMemberResponse.setDescription(
      `List was requested <t:${Math.round(Date.now() / 1000)}:R>.
  
        **Attack List**: 0 members`
    );

    return [noMemberResponse];
  }

  // Create the message list
  sortedAttackList.forEach((member) => {
    attackMessageList.push(
      `**[${member.name}](https://www.torn.com/profiles.php?XID=${
        member.id
      })** is ${member.lastActionStatus.toLowerCase()} ${
        member.lastActionRelative
      } • [Attack!](https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${
        member.id
      }) \n`
    );
  });

  const responseList = [];
  for (let i = 0; i < membersListNew.length; i += 21) {
    const response = new EmbedBuilder().setColor("Green");
    const list = attackMessageList.slice(i, i + 20).join("");
    response.setTitle(`🔫  Attack List of ${factionInfo.name} 🔫 `);
    response.setDescription(
      `List was requested <t:${Math.round(Date.now() / 1000)}:R>.
        
        **Attack List**: (**${attackMessageList.length} / ${
        membersListNew.length
      }** members in hospital)
        
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

module.exports = { sendAttackStatusEmbed };
