const { EmbedBuilder } = require("discord.js");
async function getFactionsEmbed(factions) {
  const embed = new EmbedBuilder()
    .setColor("DarkAqua")
    .setTitle("Manage Factions")
    .setDescription(
      `The amount of factions you are allowed to add is based on the deal you struck with the developer.`
    )
    .addFields(
      {
        name: "Adding a faction",
        value:
          "This functionality automatically creates a channel where the bot starts messageing status updates",
        inline: true,
      },
      {
        name: "Removing a faction",
        value:
          "This functionality removes the channel connected to the faction",
        inline: true,
      }
    );

  factions.forEach((object) => {
    embed.addFields({
      name: `${object.faction.name} [${object.faction.id}]`,
      value: `Profile: [Click here!](https://www.torn.com/factions.php?step=profile&ID=${object.faction.id})`,
    });
  });

  return embed;
}

module.exports = { getFactionsEmbed };
