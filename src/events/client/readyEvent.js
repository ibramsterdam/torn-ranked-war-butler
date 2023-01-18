// eslint-disable-next-line no-unused-vars
const { ActivityType } = require("discord.js");
const { loadCommands } = require("../../handlers/commandHandler");
require("dotenv").config();

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    loadCommands(client).then(() => {
      client.user.setActivity(
        `Torn with ${client.guilds.cache.size + 1} torn guilds`,
        {
          type: ActivityType.Playing,
        }
      );

      console.log("\nThe bot has booted up!");
    });
  },
};
