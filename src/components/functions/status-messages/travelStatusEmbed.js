const { EmbedBuilder } = require("discord.js");

async function sendTravelStatusEmbed(membersListNew, factionInfo) {
  let travelMessageList = [];
  const travelList = membersListNew.filter(
    (member) => member.statusState === "Traveling"
  );

  if (travelList.length === 0) {
    const noMemberResponse = new EmbedBuilder().setColor("Red");

    noMemberResponse.setTitle(`🏥 Hospital List of ${factionInfo.name} 🏥`);
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
  for (let i = 0; i < travelList.length; i += 20) {
    const response = new EmbedBuilder().setColor("Blue");
    response.setTitle(`🛩 Travel List of ${factionInfo.name} 🛩`);
    response.setDescription(
      `List was requested <t:${Math.round(Date.now() / 1000)}:R>.
        
        **Travel List**: (**${travelMessageList.length} / ${
        membersListNew.length
      }** members in hospital)
        
        **${i}-${i + 20}**
        ${travelMessageList.slice(i, i + 20).join("")}`
    );
    if (i > 0) {
      response.setTitle(`${i}-${i + 20}`);
      response.setDescription(
        `
        ${travelMessageList.slice(i, i + 20).join("")}`
      );
    }

    responseList.push(response);
  }

  return responseList;
}

module.exports = { sendTravelStatusEmbed };
