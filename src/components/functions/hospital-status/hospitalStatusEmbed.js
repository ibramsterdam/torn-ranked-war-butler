const { EmbedBuilder } = require("discord.js");

async function sendHospitalStatusEmbed(interaction, results, faction) {
  if (results.data.error) {
    const err = new EmbedBuilder()
      .setColor("Aqua")
      .setTitle(`🏥 No faction found 🏥`);
    return await interaction.guild.channels.cache
      .get(faction.discordChannelId.toString())
      .send({
        embeds: [err],
      });
  }

  const hospitalMap = new Map();
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

  const response = new EmbedBuilder().setColor("Aqua").setDescription(
    `List was requested <t:${Math.round(Date.now() / 1000)}:R>.

        **Important:**
        *This list does not update on its own when someone takes medication.*`
  );

  //Make map based on if member is in hospital
  factionMemberList.forEach((factionMember, id) => {
    if (factionMember.status.description.includes("In hospital")) {
      hospitalMap.set(
        [factionMember.name, playerId[id]],
        factionMember.status.until
      );
    }
  });

  //If hospital list is empty
  if (hospitalMap.size === 0) {
    response.setTitle(`🏥 No one in hospital of ${factionName} 🏥`);
  } else {
    response.setTitle(`🏥 Hospital List of ${factionName} 🏥`);
  }

  let userList = ``;
  //Order list so that earliest to leave hospital is above in message
  for (const [key, value] of [...hospitalMap.entries()].sort(
    (a, b) => a[1] - b[1]
  )) {
    userList += `[${key[0]}](https://www.torn.com/profiles.php?XID=${key[1]}) is leaving hospital <t:${value}:R> - [Attack!](https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${key[1]}) \n`;
  }

  if (hospitalMap.size !== 0) {
    response.addFields({
      name: "Hospital List",
      value: userList,
    });
  } else {
    response.addFields({
      name: "Hospital List",
      value: "No one",
    });
  }

  await interaction.guild.channels.cache
    .get(faction.discordChannelId.toString())
    .send({
      embeds: [response],
    });
}

module.exports = { sendHospitalStatusEmbed };
