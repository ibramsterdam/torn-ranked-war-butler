const { EmbedBuilder } = require("discord.js");

async function sendTravelStatusEmbed(membersListNew, factionInfo) {
  let travelMessageList = [];
  const travelList = membersListNew.filter(
    (member) => member.statusState === "Traveling"
  );

  if (travelList.length === 0) {
    const noMemberResponse = new EmbedBuilder().setColor("Red");

    noMemberResponse.setTitle(`🛩 Travel List of ${factionInfo.name} 🛩`);
    noMemberResponse.setDescription(
      `List was requested <t:${Math.round(Date.now() / 1000)}:R>.
  
        **Travel List**: 0 members`
    );

    return [noMemberResponse];
  }

  // Create the message list
  travelList.forEach((member) => {
    travelMessageList.push(
      `**[${member.name}](https://www.torn.com/profiles.php?XID=${member.id})** is ${member.statusDescription}• [Attack!](https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${member.id}) \n`
    );
  });

  const responseList = [];
  for (let i = 0; i < membersListNew.length; i += 21) {
    const response = new EmbedBuilder().setColor("Red");
    const list = travelMessageList.slice(i, i + 20).join("");
    response.setTitle(`🛩 Travel List of ${factionInfo.name} 🛩`);
    response.setDescription(
      `List was requested <t:${Math.round(Date.now() / 1000)}:R>.
        
        **Travel List**: (**${travelMessageList.length} / ${
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

module.exports = { sendTravelStatusEmbed };
