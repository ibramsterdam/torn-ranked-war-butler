// @ts-nocheck
//TODO investigate this file

const { EmbedBuilder } = require("discord.js");
async function getApiKeysEmbed(users) {
  const embed = new EmbedBuilder()
    .setColor("Aqua")
    .setTitle("Manage Api Keys")
    .setDescription(
      `The amount of api keys you are allowed to add is based on the deal you struck with the developer.
        You can create a new api key [here](https://www.torn.com/preferences.php#tab=api).
        
        Please remember
        *1. We make sure that every key is from a different user and only use the key for the discord server that it is inserted in.*
        *2. We handle these keys with absolute secrecy*
        *3. Anyone trying to manipulate this bot forfeits the right to use it*

        **Api Key:**
        `
    );

  users.forEach((object) => {
    embed.addFields({
      name: `${object.user.name} [${object.user.id}]`,
      value: `Profile: [Click here!](https://www.torn.com/profiles.php?XID=${object.user.id})
        Faction: [${object.user.faction.name}](https://www.torn.com/factions.php?step=profile&ID=${object.user.faction.id}#/)`,
    });
  });

  return embed;
}

module.exports = { getApiKeysEmbed };
