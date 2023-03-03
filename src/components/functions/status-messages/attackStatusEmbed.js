const { EmbedBuilder } = require("discord.js");
const { calculateNetworth } = require("./calculateNetworth");

async function sendAttackStatusEmbed(membersListNew, factionInfo) {
  let attackMessageList = [];
  const sortedAttackList = membersListNew
    .filter((member) => member.statusState === "Okay")
    .sort(
      (a, b) => Number(a.lastActionTimestamp) - Number(b.lastActionTimestamp)
    );

  // Create the message list
  sortedAttackList.forEach((member) => {
    const revivable = member.revivable === 1 ? `💉` : "";
    attackMessageList.push(
      `${revivable}**[${member.name}](${
        member.profileLink
      })** is ${member.lastActionStatus.toLowerCase()} ${
        member.lastActionRelative
      } • [Attack!](${member.attackLink})
      ${member.xanaxTaken} xanax, ${member.energydrinkTaken} cans, ${
        member.energyRefills
      } refills, ${member.age} days old, ${calculateNetworth(
        Number(member.networth)
      )} networth\n`
    );
  });

  const responseList = [];
  for (let i = 0; i < membersListNew.length; i += 15) {
    const response = new EmbedBuilder().setColor("Green");
    const list = attackMessageList.slice(i, i + 15).join("");
    response.setTitle(`🔫  Attack List of ${factionInfo.name} 🔫 `);
    response.setDescription(`
    List was updated <t:${Math.round(Date.now() / 1000)}:R>. \n
    **Attack List**: (**${attackMessageList.length} / ${
      membersListNew.length
    }** in hospital)\n
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

module.exports = { sendAttackStatusEmbed };
