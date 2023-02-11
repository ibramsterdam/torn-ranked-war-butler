const { EmbedBuilder } = require("discord.js");

async function sendTravelStatusEmbed(interaction, results, faction) {
  const travelMap = new Map();
  //Destructure Json to array of faction members
  const factionInfo = Object.keys(results.data);
  let factionMemberList = undefined;
  let factionName = undefined;
  let playerId;
  //Iterate over list to find out where members list is located and define variable
  for (let i = 0; i < factionInfo.length; i++) {
    if (factionInfo[i] === "members") {
      factionMemberList = Object.values(Object.values(results.data)[i]);
      playerId = Object.keys(Object.values(results.data)[i]);
    }

    if (factionInfo[i] === "name") {
      factionName = Object.values(results.data)[i];
    }
  }

  const response = new EmbedBuilder().setColor("Red");

  //Make map based on if member is in hospital
  factionMemberList.forEach((factionMember, id) => {
    if (factionMember.status.state.includes("Traveling")) {
      travelMap.set(
        [factionMember.name, playerId[id]],
        factionMember.status.description
      );
    }
  });

  let userList = [];
  if (travelMap.size !== 0) {
    //Order list so that earliest to leave hospital is above in message
    for (const [key, value] of [...travelMap.entries()].sort(
      (a, b) => a[1] - b[1]
    )) {
      userList.push(
        `**[${key[0]}](https://www.torn.com/profiles.php?XID=${key[1]})** is ${value} • [Attack!](https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${key[1]}) \n`
      );
    }
  }

  if (userList.length === 0) {
    response.setTitle(`🛩 Travel List of ${factionName} 🛩`);

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

  for (let i = 0; i < userList.length; i += 20) {
    response.setTitle(`🛩 Travel List of ${factionName} 🛩`);
    response.setDescription(
      `List was requested <t:${Math.round(Date.now() / 1000)}:R>.
        
        **Travel List**: (**${userList.length} / ${
        factionMemberList.length
      }** members in hospital)
        
        **${i}-${i + 20}**
        ${userList.slice(i, i + 20).join("")}`
    );
    if (i > 0) {
      response.setTitle(`${i}-${i + 20}`);
      response.setDescription(
        `
        ${userList.slice(i, i + 20).join("")}`
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
