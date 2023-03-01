const { EmbedBuilder } = require("discord.js");
const { calculateNetworth } = require("./calculateNetworth");

async function sendReviveStatusEmbed(membersListNew, factionInfo) {
  let reviveMessageList = [];
  const reviveList = membersListNew
    .filter((member) => member.revivable === 1)
    .sort((a, b) => {
      if (a.statusState === "Okay" && b.statusState !== "Okay") {
        return -1; // a is Okay and b is not Okay, so a should come first
      } else if (a.statusState !== "Hospital" && b.statusState === "Hospital") {
        return -1; // a is not Hospital and b is Hospital, so a should come first
      } else {
        return 0; // no need to swap positions, both objects have same status
      }
    });

  // Create the message list
  reviveList.forEach((member) => {
    reviveMessageList.push(
      `**[${member.name}](${member.profileLink})** (**${
        member.statusState
      }**) is ${member.lastActionStatus.toLowerCase()} ${
        member.lastActionRelative
      } • [Go to Hospital!](https://xa.up.railway.app/api/qvzsz)
      ${member.xanaxTaken} xanax, ${member.energydrinkTaken} cans, ${
        member.energyRefills
      } refills, ${member.age} days old, ${calculateNetworth(
        Number(member.networth)
      )} networth\n`
    );
  });

  const responseList = [];
  for (let i = 0; i < membersListNew.length; i += 15) {
    const response = new EmbedBuilder().setColor("LuminousVividPink");
    const list = reviveMessageList.slice(i, i + 15).join("");
    response.setTitle(`💉  Hospital List of ${factionInfo.name} 💉`);
    response.setDescription(`
    List was updated <t:${Math.round(Date.now() / 1000)}:R>. \n
    **Hospital List**: (**${reviveMessageList.length} / ${
      membersListNew.length
    }** are revivable)\n
    **${i}-${i + 15} members**
    ${list}`);
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

module.exports = { sendReviveStatusEmbed };
