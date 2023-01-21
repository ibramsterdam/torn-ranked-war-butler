const { ActivityType, ClientApplication } = require("discord.js");
const { loadCommands } = require("../../handlers/commandHandler");
require("dotenv").config();

module.exports = {
  name: "ready",
  once: true,
  /**
   *  @param {ClientApplication} client
   */
  execute(client) {
    client.user.setActivity(
      `Torn with ${client.guilds.cache.size + 1} torn guilds`,
      {
        type: ActivityType.Playing,
      }
    );

    loadCommands(client).then(() => {
      console.log("\nThe bot has booted up!");
    });
  },
};
