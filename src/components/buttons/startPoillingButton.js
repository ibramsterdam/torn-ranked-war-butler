const { getDiscordServer } = require("../../functions/prisma/discord");
const { getRandomItemFromArray } = require("../../util/randomItemFromArray");
const { getFactionFromTornApi } = require("../../util/tornApiUtil");
const { EmbedBuilder } = require("discord.js");
module.exports = {
  developer: false,
  data: { name: "dashboard-start-polling" },
  async execute(interaction, client) {
    const guildID = BigInt(interaction.guildId);
    const prisma = require("../../index");

    // setInterval(async () => {
    const server = await getDiscordServer(prisma, guildID);
    const randomApiKeyObject = getRandomItemFromArray(server.apiKeys);

    // Hospital status
    server.factions.forEach(async (faction) => {
      await new Promise((r) => setTimeout(r, 4000));

      const results = await getFactionFromTornApi(
        faction.factionId,
        randomApiKeyObject.value
      );

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
      //Iterate over list to find out where members list is located and define variable
      for (let i = 0; i < factionInfo.length; i++) {
        if (factionInfo[i] === "members") {
          factionMemberList = Object.values(Object.values(results.data)[i]);
        }

        if (factionInfo[i] === "name") {
          factionName = Object.values(results.data)[i];
        }
      }

      const response = new EmbedBuilder().setColor("Aqua").setDescription(
        `${
          interaction.member
        } has asked for the the hospital list <t:${Math.round(
          Date.now() / 1000
        )}:R>.

        **Important:**

        *This list does not update on its own when someone takes medication. Also, switch channels if timestamps dont seem to update.*`
      );

      //Make map based on if member is in hospital
      factionMemberList.forEach((factionMember) => {
        if (factionMember.status.description.includes("In hospital")) {
          hospitalMap.set(factionMember.name, factionMember.status.until);
        }
      });

      //If hospital list is empty
      if (hospitalMap.size === 0) {
        response.setTitle(`🏥 No one in hospital of ${factionName} 🏥`);
      } else {
        response.setTitle(`🏥 Hospital List of ${factionName} 🏥`);
      }

      //Order list so that earliest to leave hospital is above in message
      for (const [key, value] of [...hospitalMap.entries()].sort(
        (a, b) => a[1] - b[1]
      )) {
        response.addFields({
          name: `${key}`,
          value: `Leaving hospital <t:${value}:R>`,
        });
      }
      return await interaction.guild.channels.cache
        .get(faction.discordChannelId.toString())
        .send({
          embeds: [response],
        });
    });
    // }, 60000);

    return interaction.reply("Started Polling");
    /*
     * 1. load api keys
     * 2. do everything in a trycatch
     * 3. load factions and their respective channelID's
     * 4. do everything in a setInterval and
     * 5. remove the previous messages
     */
  },
};
