const { MessageEmbed } = require("discord.js");
const { getTornRankedWarInfo } = require("../../util/tornApiUtil");
const { getMyFactionWarInfo } = require("../../util/rankedWarUtil");

module.exports = {
  name: "warstatus",
  cooldown: 10,
  description: "Responds with war details",
  permission: "ADMINISTRATOR",
  options: [
    {
      name: "factionid",
      description: "Search rankedwars based on factionId",
      type: "NUMBER",
      required: false,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    Promise.all([getTornRankedWarInfo()]).then(function (results) {
      const { options } = interaction;
      const targetFactionId = options.getNumber("factionid");

      //Use randedWarUtil to return information in an array with objects
      const warObject = getMyFactionWarInfo(
        results[0].data.rankedwars,
        targetFactionId
      );

      //If targetFactionId was invalid
      if (warObject === undefined) {
        interaction.reply({
          content: "Invalid input",
        });
        return;
      }

      const warInfo = warObject[Object.keys(warObject)[1]];
      const factionArray = Object.entries(warObject[Object.keys(warObject)[0]]);
      const startDateTimestamp = new Date(warInfo.start * 1000);
      const date = new Date(startDateTimestamp);
      const dateInfo =
        date.getDate() +
        "/" +
        (date.getMonth() + 1) +
        "/" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds() +
        " Torn Time";

      //Create message
      const response = new MessageEmbed()
        .setColor("AQUA")
        .setTitle(`${factionArray[0][1].name} vs ${factionArray[1][1].name}`)
        .setDescription(`The war starts at ${dateInfo}`)
        .addField(
          `Target score: ${warInfo.target}`,
          `Target score is the wincondition in a faction war. It can be calculated by:
          TargetScore = FactionScore - EnemyFactionScore
          
          `
        );

      //War has begun!
      if (Date.now() > startDateTimestamp && warInfo.winner === 0) {
        response.setDescription(`The war has begun!`).addFields(
          {
            name: `${factionArray[0][1].name}`,
            value: `Score: ${factionArray[0][1].score}
        Chain: ${factionArray[0][1].chain}
        `,
            inline: true,
          },
          {
            name: `${factionArray[1][1].name}`,
            value: `Score: ${factionArray[1][1].score}
        Chain: ${factionArray[1][1].chain}
        `,
            inline: true,
          },
          {
            name: `Currently Winning`,
            value:
              factionArray[1][1].score > factionArray[0][1].score
                ? `${factionArray[1][1].name} is winning by ${
                    factionArray[1][1].score - factionArray[0][1].score
                  }`
                : `${factionArray[0][1].name} is winning by ${
                    factionArray[0][1].score - factionArray[1][1].score
                  }`,
            inline: false,
          }
        );
      }

      if (warInfo.winner !== 0) {
        response.setDescription(`The war has ended!`).addField(
          "Winner",
          warInfo.winner === factionArray[0][0]
            ? `${factionArray[1][1].name} won with a score of ${factionArray[1][1].score}
              vs
              ${factionArray[0][1].name} with a score of ${factionArray[0][1].score}
              `
            : `${factionArray[0][1].name} won with a score of ${factionArray[0][1].score}
            vs
            ${factionArray[1][1].name} with a score of ${factionArray[1][1].score}
            `
        );
      }

      //Reply to the discord client
      interaction.reply({
        embeds: [response],
        fetchReply: true,
      });
    });
  },
};
