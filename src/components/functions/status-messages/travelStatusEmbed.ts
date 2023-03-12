// @ts-nocheck
//TODO investigate this file
const { EmbedBuilder } = require("discord.js");

async function sendTravelStatusEmbed(membersListNew, factionInfo) {
  let travelMessageList = [];
  const travelList = membersListNew.filter(
    (member) => member.statusState === "Traveling"
  );

  // Create the message list
  travelList.forEach((member, index) => {
    travelMessageList.push(
      `**[${member.name}](${member.profileLink}) [${index + 1}]** is ${
        member.statusDescription
      }• [Attack!](${member.attackLink}) \n`
    );
  });

  const list = travelMessageList.join("");
  const response = new EmbedBuilder().setColor("Red");
  response.setTitle(`🛩 Travel List of ${factionInfo.name} 🛩`);
  response.setDescription(
    `List was updated <t:${Math.round(Date.now() / 1000)}:R>.
        
        ${list}`
  );

  return [response];
}

module.exports = { sendTravelStatusEmbed };
