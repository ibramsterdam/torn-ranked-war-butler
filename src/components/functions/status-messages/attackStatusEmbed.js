const { EmbedBuilder } = require("discord.js");

async function sendAttackStatusEmbed(
  interaction,
  membersListNew,
  faction,
  factionInfo
) {
  let attackMessageList = [];
  const response = new EmbedBuilder().setColor("Green");
  const sortedAttackList = membersListNew
    .filter((member) => member.statusState === "Okay")
    .sort(
      (a, b) => Number(a.lastActionTimestamp) - Number(b.lastActionTimestamp)
    );

  if (sortedAttackList.length === 0) {
    response.setTitle(`🔫  Attack List of ${factionInfo.name} 🔫 `);
    response.setDescription(
      `List was requested <t:${Math.round(Date.now() / 1000)}:R>.
  
        **Attack List**: 0 members`
    );

    return await interaction.guild.channels.cache
      .get(faction.discordChannelId.toString())
      .send({
        embeds: [response],
      });
  }

  // Create the message list
  sortedAttackList.forEach((member) => {
    attackMessageList.push(
      `**[${member.name}](https://www.torn.com/profiles.php?XID=${
        member.id
      })** is ${member.lastActionStatus.toLowerCase()} ${
        member.lastActionRelative
      } • [Attack!](https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${
        member.id
      }) \n`
    );
  });

  for (let i = 0; i < sortedAttackList.length; i += 20) {
    response.setTitle(`🔫  Attack List of ${factionInfo.name} 🔫 `);
    response.setDescription(
      `List was requested <t:${Math.round(Date.now() / 1000)}:R>.
        
        **Attack List**: (**${attackMessageList.length} / ${
        membersListNew.length
      }** members in hospital)
        
        **${i}-${i + 20}**
        ${attackMessageList.slice(i, i + 20).join("")}`
    );
    if (i > 0) {
      response.setTitle(`${i}-${i + 20}`);
      response.setDescription(
        `
        ${attackMessageList.slice(i, i + 20).join("")}`
      );
    }
    await interaction.guild.channels.cache
      .get(faction.discordChannelId.toString())
      .send({
        embeds: [response],
      });
  }
}

module.exports = { sendAttackStatusEmbed };
