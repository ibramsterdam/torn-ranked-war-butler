export function roundBigNum(num: any) {
  const value = Number(num);
  // Check if the number is greater than or equal to 1 billion
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(3) + "**B**"; // Return the number divided by 1 billion, rounded to 3 decimal places, and with the letter "B" added
  }
  // Check if the number is greater than or equal to 1 million
  else if (value >= 1000000) {
    return (value / 1000000).toFixed(0) + "**M**"; // Return the number divided by 1 million, rounded to 3 decimal places, and with the letter "M" added
  }
  // Check if the number is greater than or equal to 1 thousand
  else if (value >= 1000) {
    return (value / 1000).toFixed(0) + "**K**"; // Return the number divided by 1 thousand, rounded to 3 decimal places, and with the letter "K" added
  }
  // Otherwise, return the original number
  else {
    return value.toString();
  }
}
export function generateAttackMessageList(list: any) {
  let messageList: any = [];
  list.forEach((member: any, index: number) => {
    const revivable = member.revivable === 1 ? `💉 •` : "";
    const spyStats = member.spyReportDate
      ? `
       🗡️${roundBigNum(member.strength)}• 🛡️${roundBigNum(
          member.defense
        )}• 🏃‍♂️${roundBigNum(member.speed)}• 💨${roundBigNum(
          member.dexterity
        )}• 💪${roundBigNum(member.statTotal)}
      `
      : `
       💊 ${member.xanaxTaken}• 🥫${member.energydrinkTaken}• 📅 ${
          member.age
        } • 💰${roundBigNum(member.networth)}
      `;
    messageList.push(
      `**[${member.name}](${member.profileLink}) [${
        index + 1
      }]** • ${revivable} ${member.lastActionStatus.toLowerCase()} ${
        member.lastActionRelative
      } • [Attack](${member.attackLink})${spyStats}`
    );
  });

  return messageList;
}

export function generateHospitalMessageList(list: any) {
  let messageList: any = [];
  list.forEach((member: any, index: any) => {
    const revivable = member.revivable === 1 ? `💉 •` : "";
    const spyStats = member.spyReportDate
      ? `
        🗡️${roundBigNum(member.strength)}• 🛡️${roundBigNum(
          member.defense
        )}• 🏃‍♂️${roundBigNum(member.speed)}• 💨${roundBigNum(
          member.dexterity
        )}• 💪${roundBigNum(member.statTotal)}
      `
      : `
       💊 ${member.xanaxTaken}• 🥫${member.energydrinkTaken}• 📅 ${
          member.age
        } • 💰${roundBigNum(member.networth)}
      `;
    messageList.push(
      `**[${member.name}](${member.profileLink}) [${
        index + 1
      }]** • ${revivable} leaves the hospital  <t:${
        member.statusUntil
      }:R> • [Attack](${member.attackLink})${spyStats}`
    );
  });

  return messageList;
}
