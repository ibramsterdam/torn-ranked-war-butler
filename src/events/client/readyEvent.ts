import { ActivityType, Client } from "discord.js";
import { handleCommands } from "../../functions/handlers/commandHandler";
import {
  getAllUsers,
  getAllUsersThatAreTrackedOnAServer,
} from "../../functions/prisma/user";
import { updateUsers } from "../../functions/updateUsers";
import { prisma } from "../../index";

export async function execute(client: any) {
  client.user.setActivity(
    `Torn with ${client.guilds.cache.size + 1} torn guilds`,
    {
      type: ActivityType.Playing,
    }
  );

  const users = await getAllUsersThatAreTrackedOnAServer(prisma);
  const userParts = splitArrayIntoParts(users, 1);
  // userParts.forEach((part) => updateUsers(part));

  handleCommands(client).then(() => {
    console.log("\nThe bot has booted up!");
  });
}

export const name = "ready";
export const once = true;

function splitArrayIntoParts(arr: any, numParts: any) {
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
