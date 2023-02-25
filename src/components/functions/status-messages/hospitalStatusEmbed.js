const { EmbedBuilder } = require("discord.js");

async function sendHospitalStatusEmbed(membersListNew, factionInfo) {
  let hospitalMessageList = [];
  const sortedHospitalList = membersListNew
    .filter((member) => member.statusState === "Hospital")
    .sort((a, b) => Number(a.statusUntil) - Number(b.statusUntil));

  // Create the message list
  sortedHospitalList.forEach((member) => {
    hospitalMessageList.push(
      `**[${member.name}](https://www.torn.com/profiles.php?XID=${member.id})** is leaving hospital <t:${member.statusUntil}:R> • [Attack!](https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${member.id}) \n`
    );
  });

  const responseList = [];
  for (let i = 0; i < membersListNew.length; i += 21) {
    const response = new EmbedBuilder().setColor("Blue");
    const list = hospitalMessageList.slice(i, i + 20).join("");
    response.setTitle(`🏥 Hospital List of ${factionInfo.name} 🏥`);
    response.setDescription(
      `List was updated <t:${Math.round(Date.now() / 1000)}:R>.
  
          **Hospital List**: (**${hospitalMessageList.length} / ${
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

module.exports = { sendHospitalStatusEmbed };
