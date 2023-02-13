const { EmbedBuilder } = require("discord.js");

async function sendHospitalStatusEmbed(membersListNew, factionInfo) {
  let hospitalMessageList = [];
  const sortedHospitalList = membersListNew
    .filter((member) => member.statusState === "Hospital")
    .sort((a, b) => Number(a.statusUntil) - Number(b.statusUntil));

  if (sortedHospitalList.length === 0) {
    const noMemberResponse = new EmbedBuilder().setColor("Blue");
    noMemberResponse.setTitle(`🏥 Hospital List of ${factionInfo.name} 🏥`);
    noMemberResponse.setDescription(
      `List was requested <t:${Math.round(Date.now() / 1000)}:R>.
  
        **Hospital List**: 0 members`
    );

    return [noMemberResponse];
  }

  // Create the message list
  sortedHospitalList.forEach((member) => {
    hospitalMessageList.push(
      `**[${member.name}](https://www.torn.com/profiles.php?XID=${member.id})** is leaving hospital <t:${member.statusUntil}:R> • [Attack!](https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${member.id}) \n`
    );
  });

  const responseList = [];
  for (let i = 0; i < hospitalMessageList.length; i += 21) {
    const response = new EmbedBuilder().setColor("Blue");
    response.setTitle(`🏥 Hospital List of ${factionInfo.name} 🏥`);
    response.setDescription(
      `List was requested <t:${Math.round(Date.now() / 1000)}:R>.
  
          **Hospital List**: (**${hospitalMessageList.length} / ${
        membersListNew.length
      }** members in hospital)
  
          **${i}-${i + 20} members**
          ${hospitalMessageList.slice(i, i + 20).join("")}`
    );

    if (i > 0) {
      response.setTitle(`${i}-${i + 20} members`);
      response.setDescription(
        `
        ${hospitalMessageList.slice(i, i + 20).join("")}`
      );
    }

    responseList.push(response);
  }

  return responseList;
}

module.exports = { sendHospitalStatusEmbed };
