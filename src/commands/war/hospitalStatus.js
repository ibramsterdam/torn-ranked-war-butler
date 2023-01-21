const {
  EmbedBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const { getFaction } = require("../../util/tornApiUtil");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hospitalstatus")
    .setDescription(
      "Deletes a specified number of messages from channel or a target."
    )
    .addNumberOption((option) =>
      option
        .setName("factionid")
        .setDescription(
          "Select the amount of messages to delete from a channel or a target."
        )
        .setRequired(true)
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply();

    const { options } = interaction;
    const targetFactionId = options.getNumber("factionid");
    const hospitalMap = new Map();
    const results = await getFaction(targetFactionId);

    if (results.data.error) {
      const err = new EmbedBuilder()
        .setColor("Aqua")
        .setTitle(`🏥 No faction found 🏥`);
      await interaction.followUp({
        embeds: [err],
      });

      return;
    }
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

    //Reply to the discord client
    await interaction.followUp({
      embeds: [response],
    });
  },
};
