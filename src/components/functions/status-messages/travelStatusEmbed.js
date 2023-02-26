const { EmbedBuilder } = require("discord.js");

async function sendTravelStatusEmbed(membersListNew, factionInfo) {
  let travelMessageList = [];
  const travelList = membersListNew.filter(
    (member) => member.statusState === "Traveling"
  );

  // Create the message list
  travelList.forEach((member) => {
    travelMessageList.push(
      `**[${member.name}](${member.profileLink})** is ${member.statusDescription}• [Attack!](${member.attackLink}) \n`
    );
  });

  const responseList = [];
  for (let i = 0; i < membersListNew.length; i += 25) {
    const response = new EmbedBuilder().setColor("Red");
    const list = travelMessageList.slice(i, i + 25).join("");
    response.setTitle(`🛩 Travel List of ${factionInfo.name} 🛩`);
    response.setDescription(
      `List was updated <t:${Math.round(Date.now() / 1000)}:R>.
        
        **Travel List**: (**${travelMessageList.length} / ${
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

module.exports = { sendTravelStatusEmbed };
