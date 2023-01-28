const { ActivityType, Client } = require("discord.js");
const { handleCommands } = require("../../functions/handlers/commandHandler");
require("dotenv").config();

module.exports = {
  name: "ready",
  once: true,
  /**
   *  @param {Client} client
   */
  async execute(client) {
    client.user.setActivity(
      `Torn with ${client.guilds.cache.size + 1} torn guilds`,
      {
        type: ActivityType.Playing,
      }
    );

    // Deletion of channels on prod
    // const guild = await client.guilds.fetch();
    // await guild.channels.delete();

    handleCommands(client).then(() => {
      console.log("\nThe bot has booted up!");
    });
  },
};
