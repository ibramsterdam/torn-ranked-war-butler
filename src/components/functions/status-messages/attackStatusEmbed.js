const { EmbedBuilder } = require("discord.js");

async function sendAttackStatusEmbed(membersListNew, factionInfo) {
  let attackMessageList = [];
  const sortedAttackList = membersListNew
    .filter((member) => member.statusState === "Okay")
    .sort(
      (a, b) => Number(a.lastActionTimestamp) - Number(b.lastActionTimestamp)
    );

  // Create the message list
  sortedAttackList.forEach((member) => {
    attackMessageList.push(
      `**[${member.name}](${
        member.profileLink
      })** is ${member.lastActionStatus.toLowerCase()} ${
        member.lastActionRelative
      } • [Attack!](${member.attackLink}) \n`
    );
  });

  const responseList = [];
  for (let i = 0; i < membersListNew.length; i += 25) {
    const response = new EmbedBuilder().setColor("Green");
    const list = attackMessageList.slice(i, i + 25).join("");
    response.setTitle(`🔫  Attack List of ${factionInfo.name} 🔫 `);
    response.setDescription(
      `List was updated <t:${Math.round(Date.now() / 1000)}:R>.
        
        **Attack List**: (**${attackMessageList.length} / ${
        membersListNew.length
      }** members in hospital)
        
        **${i}-${i + 25} members**
        ${list}`
    );
    if (i > 0) {
      if (i > 80) i = 80;
      response.setTitle(`${i + 1}-${i + 25} members`);
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
