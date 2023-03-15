import { prisma } from "../index";
import { getAllUsersThatAreTrackedOnAServer } from "../functions/prisma/user";
import { getRandomItemFromArray } from "../util/randomItemFromArray";
import { getUserFromTornApiById } from "../util/tornApiUtil";
import { getBrainSurgeonApiKeys } from "../functions/prisma/apiKey";
import { updateUserPersonalStats } from "../functions/prisma/user";

export async function execute() {
  while (true) {
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

  for (const user of users) {
    const randomApiKeyObject = getRandomItemFromArray(keys);
    const latestUserInfo: any = await getUserFromTornApiById(
      randomApiKeyObject.value,
      user.id
    );

    if (latestUserInfo.data.error) {
      console.log("Error in updateUsersEvent");
      await delay(2000);
    } else {
      await updateUserPersonalStats(
        prisma,
        user.id,
        latestUserInfo.data.personalstats,
        latestUserInfo.data.age,
        latestUserInfo.data.revivable
      );
      await delay(1000);
    }
  }
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
