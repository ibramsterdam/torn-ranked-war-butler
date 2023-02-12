const { EmbedBuilder } = require("discord.js");

async function sendTravelStatusEmbed(
  interaction,
  membersListNew,
  faction,
  factionInfo
) {
  let travelMessageList = [];
  const response = new EmbedBuilder().setColor("Aqua");
  const travelList = membersListNew.filter(
    (member) => member.statusState === "Traveling"
  );

  if (travelList.length === 0) {
    response.setTitle(`🏥 Hospital List of ${factionInfo.name} 🏥`);
    response.setDescription(
      `List was requested <t:${Math.round(Date.now() / 1000)}:R>.
  
        **Travel List**: 0 members`
    );

    return await interaction.guild.channels.cache
      .get(faction.discordChannelId.toString())
      .send({
        embeds: [response],
      });
  }

  // Create the message list
  travelList.forEach((member) => {
    travelMessageList.push(
      `**[${member.name}](https://www.torn.com/profiles.php?XID=${member.id})** is ${member.statusDescription}• [Attack!](https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${member.id}) \n`
    );
  });

  for (let i = 0; i < travelList.length; i += 20) {
    response.setTitle(`🛩 Travel List of ${factionInfo.name} 🛩`);
    response.setDescription(
      `List was requested <t:${Math.round(Date.now() / 1000)}:R>.
        
        **Travel List**: (**${travelMessageList.length} / ${
        membersListNew.length
      }** members in hospital)
        
        **${i}-${i + 20}**
        ${travelMessageList.slice(i, i + 20).join("")}`
    );
    if (i > 0) {
      response.setTitle(`${i}-${i + 20}`);
      response.setDescription(
        `
        ${travelMessageList.slice(i, i + 20).join("")}`
      );
    }
    await interaction.guild.channels.cache
      .get(faction.discordChannelId.toString())
      .send({
        embeds: [response],
      });
  }
}

module.exports = { sendTravelStatusEmbed };
