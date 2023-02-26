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
    const revivable = member.revivable === 1 ? ` and **REVIVABLE**` : "";
    attackMessageList.push(
      `**[${member.name}](${
        member.profileLink
      })** is ${member.lastActionStatus.toLowerCase()} ${
        member.lastActionRelative
      } • [Attack!](${member.attackLink})
      ${member.xanaxTaken} xanax, ${member.energydrinkTaken} cans, ${
        member.energyRefills
      } refills, ${member.age} days old, ${formatNumber(
        Number(member.networth)
      )} networth${revivable}\n`
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
  // console.log(responseList);

  return responseList;
}

function formatNumber(num) {
  // Check if the number is greater than or equal to 1 billion
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(3) + " B"; // Return the number divided by 1 billion, rounded to 3 decimal places, and with the letter "B" added
  }
  // Check if the number is greater than or equal to 1 million
  else if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + " M"; // Return the number divided by 1 million, rounded to 3 decimal places, and with the letter "M" added
  }
  // Check if the number is greater than or equal to 1 thousand
  else if (num >= 1000) {
    return (num / 1000).toFixed(0) + " K"; // Return the number divided by 1 thousand, rounded to 3 decimal places, and with the letter "K" added
  }
  // Otherwise, return the original number
  else {
    return num.toString();
  }
}

module.exports = { sendAttackStatusEmbed };
