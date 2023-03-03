const { EmbedBuilder } = require("discord.js");
const { calculateNetworth } = require("./calculateNetworth");

async function sendHospitalStatusEmbed(membersListNew, factionInfo) {
  let hospitalMessageList = [];
  const sortedHospitalList = membersListNew
    .filter((member) => member.statusState === "Hospital")
    .sort((a, b) => Number(a.statusUntil) - Number(b.statusUntil));

  // Create the message list
  sortedHospitalList.forEach((member) => {
    const revivable = member.revivable === 1 ? `💉` : "";
    hospitalMessageList.push(
      `${revivable}**[${member.name}](${
        member.profileLink
      })** leaves the hospital <t:${member.statusUntil}:R> • [Attack!](${
        member.attackLink
      })
      ${member.xanaxTaken} xanax, ${member.energydrinkTaken} cans, ${
        member.energyRefills
      } refills, ${member.age} days old, ${calculateNetworth(
        Number(member.networth)
      )} networth\n`
    );
  });

  const responseList = [];
  for (let i = 0; i < membersListNew.length; i += 15) {
    const response = new EmbedBuilder().setColor("Blue");
    const list = hospitalMessageList.slice(i, i + 15).join("");
    response.setTitle(`🏥 Hospital List of ${factionInfo.name} 🏥`);
    response.setDescription(
      `List was updated <t:${Math.round(Date.now() / 1000)}:R>.
  
          **Hospital List**: (**${hospitalMessageList.length} / ${
        membersListNew.length
      }** members in hospital)
  
          **${i}-${i + 15} members**
          ${list}`
    );

    if (i > 0) {
      response.setTitle(`${i + 1}-${i + 15} members`);
      if (i >= 90) response.setTitle(`${i + 1}-100 members`);
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
