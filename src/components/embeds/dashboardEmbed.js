const { EmbedBuilder } = require("discord.js");

async function dashboardEmbed() {
  return new EmbedBuilder()
    .setTitle("Ranked War Assistant")
    .setDescription("Whitelisting happends when payment is made")
    .addFields(
      {
        name: "General information",
        value:
          "*Whitelist status* : <Yes/no>\n*ApiKey status* : <x keys connected>\n*Polling speed* : <60 requests p/m>",
      },
      {
        name: "Tracking the following factions",
        value: "Barry\nMaud\nHarry\nBanoe",
        inline: true,
      },
      {
        name: "Using the Api keys from",
        value: "Barry\nMaud\nHarry\nBanoe",
        inline: true,
      }
    )
    .setColor("#00b0f4")
    .setFooter({
      text: "Good luck on warring!",
      iconURL: "https://slate.dan.onl/slate.png",
    })
    .setTimestamp();
}

module.exports = { dashboardEmbed };
