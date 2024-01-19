import { prisma } from "../index";
import { getAllUsersThatAreTrackedOnAServer } from "../functions/prisma/user";
import { getUserFromTornApiByIdNew } from "../util/tornApiUtil";
import { getBrainSurgeonApiKeys } from "../functions/prisma/apiKey";
import { updateUserPersonalStats } from "../functions/prisma/user";
import * as dotenv from "dotenv";
dotenv.config();

export async function execute() {
  while (process.env.IS_PROD === "notnow") {
    const users = await getAllUsersThatAreTrackedOnAServer(prisma);
    
    const userParts = splitArrayIntoParts(users, 3);

    console.log("Starting to update", users.length, "users");
    const promises = userParts.map((part, index) => updateUsers(part, index));
    const startTime = performance.now();
    await Promise.all(promises);
    const endTime = performance.now();
    const time = Math.floor((endTime - startTime) / 1000);
    console.log(`Updating all users took: ${time} seconds.`);
  }
}
export const name = "update-users";
export const once = true;
export const now = true;

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

async function updateUsers(users: any, callIndex: number) {
  const keys = await getBrainSurgeonApiKeys(prisma);
  if (!keys) return console.log("No keys");

  for (const user of users) {
    const randomIndex = Math.floor(Math.random() * keys.length);
    const randomApiKeyObject = keys[randomIndex];

    const result = await getUserFromTornApiByIdNew(
      randomApiKeyObject.value,
      user.id
    );

    if (result.error || result.data.error) {
      console.log("Error in updateUsersEvent? ", result.data.error);

      await delay(2000);
    } else {
      await updateUserPersonalStats(
        prisma,
        user.id,
        result.data.personalstats,
        result.data.age,
        result.data.revivable
      );
      await delay(1000);
    }
  }
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
