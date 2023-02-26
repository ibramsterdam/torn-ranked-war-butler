const { ActivityType, Client } = require("discord.js");
const prisma = require("../..");
const { handleCommands } = require("../../functions/handlers/commandHandler");
const {
  removeUserRelationWithFaction,
} = require("../../functions/prisma/user");
const { updateUsers } = require("../../functions/updateUsers");
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

    updateUsers();
    handleCommands(client).then(() => {
      console.log("\nThe bot has booted up!");
    });
  },
};
