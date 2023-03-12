// @ts-nocheck

import { ActivityType, Client } from "discord.js";
import prisma from "../../index";
import { handleCommands } from "../../functions/handlers/commandHandler";
import { getAllUsersThatAreTrackedOnAServer } from "../../functions/prisma/user";
import { updateUsers } from "../../functions/updateUsers";
require("dotenv").config();

module.exports = {
  name: "ready",
  once: true,
  async execute(client: CLient) {
    client.user.setActivity(
      `Torn with ${client.guilds.cache.size + 1} torn guilds`,
      {
        type: ActivityType.Playing,
      }
    );

    const users = await getAllUsersThatAreTrackedOnAServer(prisma);
    const userParts = splitArrayIntoParts(users, 1);
    userParts.forEach((part) => updateUsers(part));

    handleCommands(client).then(() => {
      console.log("\nThe bot has booted up!");
    });
  },
};

function splitArrayIntoParts(arr, numParts) {
  const len = arr.length;
  const partSize = Math.ceil(len / numParts);

  const result = [];
  for (let i = 0; i < numParts; i++) {
    const start = i * partSize;
    const end = start + partSize;
    result.push(arr.slice(start, end));
  }

  return result;
}
